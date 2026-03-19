using System.Text.Json;
using CarFleet.Core.Data;
using CarFleet.Core.Models;
using Microsoft.Extensions.Logging;

namespace CarFleet.Core.Services;

public interface IDataSeederService
{
    Task SeedDatabaseAsync(FleetDbContext context);
}

public class DataSeederService : IDataSeederService
{
    private readonly ILogger<DataSeederService> _logger;

    public DataSeederService(ILogger<DataSeederService> logger)
    {
        _logger = logger;
    }

    public async Task SeedDatabaseAsync(FleetDbContext context)
    {
        try
        {
            // Check if data already exists
            if (context.Roles.Any() || context.FleetLocations.Any() || context.Vehicles.Any() || context.Drivers.Any())
            {
                _logger.LogInformation("Database already contains data. Skipping seeding.");
                return;
            }

            var seedDataPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "seed-data.json");

            if (!File.Exists(seedDataPath))
            {
                _logger.LogWarning($"Seed data file not found at {seedDataPath}");
                return;
            }

            var jsonContent = await File.ReadAllTextAsync(seedDataPath);
            using var jsonDoc = JsonDocument.Parse(jsonContent);
            var root = jsonDoc.RootElement;

            // Seed Roles first as they are referenced by other entities
            await SeedRolesAsync(context, root.GetProperty("roles"));
            await context.SaveChangesAsync();

            // Seed Fleet Locations
            await SeedFleetLocationsAsync(context, root.GetProperty("fleetLocations"));
            await context.SaveChangesAsync();

            // Seed Vehicles
            await SeedVehiclesAsync(context, root.GetProperty("vehicles"), root.GetProperty("fleetLocations"));
            await context.SaveChangesAsync();

            // Seed Drivers
            await SeedDriversAsync(context, root.GetProperty("drivers"));
            await context.SaveChangesAsync();

            // Seed Users
            await SeedUsersAsync(context, root.GetProperty("users"), root.GetProperty("roles"));
            await context.SaveChangesAsync();

            // Seed Vehicle Assignments
            await SeedVehicleAssignmentsAsync(context, root.GetProperty("vehicleAssignments"));
            await context.SaveChangesAsync();

            // Seed Fuel Logs
            await SeedFuelLogsAsync(context, root.GetProperty("fuelLogs"));
            await context.SaveChangesAsync();

            // Seed Trips
            await SeedTripsAsync(context, root.GetProperty("trips"));
            await context.SaveChangesAsync();

            // Seed Service Records
            await SeedServiceRecordsAsync(context, root.GetProperty("serviceRecords"));
            await context.SaveChangesAsync();

            _logger.LogInformation("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task SeedRolesAsync(FleetDbContext context, JsonElement rolesElement)
    {
        if (rolesElement.ValueKind != JsonValueKind.Array)
            return;

        foreach (var roleElement in rolesElement.EnumerateArray())
        {
            var roleType = Enum.Parse<RoleType>(roleElement.GetProperty("roleType").GetString()!);

            var role = new Role
            {
                Name = roleElement.GetProperty("name").GetString()!,
                RoleType = roleType,
                Description = roleElement.GetProperty("description").GetString()!
            };

            context.Roles.Add(role);
        }

        await Task.CompletedTask;
    }

    private async Task SeedFleetLocationsAsync(FleetDbContext context, JsonElement locationsElement)
    {
        if (locationsElement.ValueKind != JsonValueKind.Array)
            return;

        foreach (var locationElement in locationsElement.EnumerateArray())
        {
            var location = new FleetLocation
            {
                Name = locationElement.GetProperty("name").GetString()!,
                Address = locationElement.GetProperty("address").GetString()!,
                City = locationElement.GetProperty("city").GetString()!,
                State = locationElement.GetProperty("state").GetString()!,
                PostalCode = locationElement.GetProperty("postalCode").GetString()!,
                Country = locationElement.GetProperty("country").GetString()!,
                Latitude = locationElement.GetProperty("latitude").GetDecimal(),
                Longitude = locationElement.GetProperty("longitude").GetDecimal(),
                IsActive = locationElement.GetProperty("isActive").GetBoolean()
            };

            context.FleetLocations.Add(location);
        }

        await Task.CompletedTask;
    }

    private async Task SeedVehiclesAsync(FleetDbContext context, JsonElement vehiclesElement, JsonElement locationsElement)
    {
        if (vehiclesElement.ValueKind != JsonValueKind.Array)
            return;

        var locations = context.FleetLocations.ToList();

        foreach (var vehicleElement in vehiclesElement.EnumerateArray())
        {
            var locationIndex = vehicleElement.GetProperty("fleetLocationIndex").GetInt32();
            var fuelType = Enum.Parse<FuelType>(vehicleElement.GetProperty("fuelType").GetString()!);
            var status = Enum.Parse<VehicleStatus>(vehicleElement.GetProperty("status").GetString()!);

            DateTime purchaseDate = DateTime.UtcNow;

            if (vehicleElement.TryGetProperty("yearsAgo", out var yearsAgoElement))
            {
                purchaseDate = DateTime.UtcNow.AddYears(-yearsAgoElement.GetInt32());
            }
            else if (vehicleElement.TryGetProperty("monthsAgo", out var monthsAgoElement))
            {
                purchaseDate = DateTime.UtcNow.AddMonths(-monthsAgoElement.GetInt32());
            }

            var vehicle = new Vehicle
            {
                Make = vehicleElement.GetProperty("make").GetString()!,
                Model = vehicleElement.GetProperty("model").GetString()!,
                Vin = vehicleElement.GetProperty("vin").GetString()!,
                Year = vehicleElement.GetProperty("year").GetInt32(),
                LicensePlate = vehicleElement.GetProperty("licensePlate").GetString()!,
                Color = vehicleElement.GetProperty("color").GetString()!,
                FuelType = fuelType,
                Status = status,
                FleetLocationId = locations[locationIndex].Id,
                PurchaseDate = purchaseDate
            };

            context.Vehicles.Add(vehicle);
        }

        await Task.CompletedTask;
    }

    private async Task SeedDriversAsync(FleetDbContext context, JsonElement driversElement)
    {
        if (driversElement.ValueKind != JsonValueKind.Array)
            return;

        foreach (var driverElement in driversElement.EnumerateArray())
        {
            var status = Enum.Parse<DriverStatus>(driverElement.GetProperty("status").GetString()!);

            DateTime licenseExpiryDate = DateTime.UtcNow;
            if (driverElement.TryGetProperty("licenseExpiryYears", out var licenseYearsElement))
            {
                licenseExpiryDate = DateTime.UtcNow.AddYears(licenseYearsElement.GetInt32());
            }

            DateTime hireDate = DateTime.UtcNow;
            if (driverElement.TryGetProperty("hireYearsAgo", out var hireYearsElement))
            {
                hireDate = DateTime.UtcNow.AddYears(-hireYearsElement.GetInt32());
            }
            else if (driverElement.TryGetProperty("hireMonthsAgo", out var hireMonthsElement))
            {
                hireDate = DateTime.UtcNow.AddMonths(-hireMonthsElement.GetInt32());
            }

            var driver = new Driver
            {
                FirstName = driverElement.GetProperty("firstName").GetString()!,
                LastName = driverElement.GetProperty("lastName").GetString()!,
                LicenseNumber = driverElement.GetProperty("licenseNumber").GetString()!,
                LicenseExpiryDate = licenseExpiryDate,
                Phone = driverElement.GetProperty("phone").GetString()!,
                Email = driverElement.GetProperty("email").GetString()!,
                HireDate = hireDate,
                Status = status
            };

            context.Drivers.Add(driver);
        }

        await Task.CompletedTask;
    }

    private async Task SeedUsersAsync(FleetDbContext context, JsonElement usersElement, JsonElement rolesElement)
    {
        if (usersElement.ValueKind != JsonValueKind.Array)
            return;

        var roles = context.Roles.ToList();
        var drivers = context.Drivers.ToList();

        foreach (var userElement in usersElement.EnumerateArray())
        {
            var roleIndex = userElement.GetProperty("roleIndex").GetInt32();
            
            int? driverId = null;
            if (userElement.TryGetProperty("driverIndex", out var driverIndexElement) && 
                driverIndexElement.ValueKind != JsonValueKind.Null)
            {
                var driverIndex = driverIndexElement.GetInt32();
                if (driverIndex >= 0 && driverIndex < drivers.Count)
                {
                    driverId = drivers[driverIndex].Id;
                }
            }

            var user = new User
            {
                Username = userElement.GetProperty("username").GetString()!,
                Email = userElement.GetProperty("email").GetString()!,
                FullName = userElement.GetProperty("fullName").GetString()!,
                PasswordHash = userElement.GetProperty("passwordHash").GetString()!,
                RoleId = roles[roleIndex].Id,
                IsActive = userElement.GetProperty("isActive").GetBoolean(),
                CreatedAt = DateTime.UtcNow,
                DriverId = driverId
            };

            context.Users.Add(user);
        }

        await Task.CompletedTask;
    }

    private async Task SeedVehicleAssignmentsAsync(FleetDbContext context, JsonElement assignmentsElement)
    {
        if (assignmentsElement.ValueKind != JsonValueKind.Array)
            return;

        var vehicles = context.Vehicles.ToList();
        var drivers = context.Drivers.ToList();

        foreach (var assignmentElement in assignmentsElement.EnumerateArray())
        {
            var vehicleIndex = assignmentElement.GetProperty("vehicleIndex").GetInt32();
            var driverIndex = assignmentElement.GetProperty("driverIndex").GetInt32();
            var startMonthsAgo = assignmentElement.GetProperty("startMonthsAgo").GetInt32();

            var assignment = new VehicleAssignment
            {
                VehicleId = vehicles[vehicleIndex].Id,
                DriverId = drivers[driverIndex].Id,
                StartDate = DateTime.UtcNow.AddMonths(-startMonthsAgo),
                EndDate = null,
                AssignedBy = assignmentElement.GetProperty("assignedBy").GetString()!,
                Notes = assignmentElement.GetProperty("notes").GetString()!
            };

            context.VehicleAssignments.Add(assignment);
        }

        await Task.CompletedTask;
    }

    private async Task SeedFuelLogsAsync(FleetDbContext context, JsonElement fuelLogsElement)
    {
        if (fuelLogsElement.ValueKind != JsonValueKind.Array)
            return;

        var vehicles = context.Vehicles.ToList();
        var drivers = context.Drivers.ToList();

        foreach (var fuelLogElement in fuelLogsElement.EnumerateArray())
        {
            var vehicleIndex = fuelLogElement.GetProperty("vehicleIndex").GetInt32();
            var driverIndex = fuelLogElement.GetProperty("driverIndex").GetInt32();
            var daysAgo = fuelLogElement.GetProperty("daysAgo").GetInt32();

            var fuelLog = new FuelLog
            {
                VehicleId = vehicles[vehicleIndex].Id,
                DriverId = drivers[driverIndex].Id,
                Liters = fuelLogElement.GetProperty("liters").GetDecimal(),
                PricePerLiter = fuelLogElement.GetProperty("pricePerLiter").GetDecimal(),
                TotalCost = fuelLogElement.GetProperty("totalCost").GetDecimal(),
                Odometer = fuelLogElement.GetProperty("odometer").GetInt32(),
                FuelDate = DateTime.UtcNow.AddDays(-daysAgo),
                FuelStation = fuelLogElement.GetProperty("fuelStation").GetString()!
            };

            context.FuelLogs.Add(fuelLog);
        }

        await Task.CompletedTask;
    }

    private async Task SeedTripsAsync(FleetDbContext context, JsonElement tripsElement)
    {
        if (tripsElement.ValueKind != JsonValueKind.Array)
            return;

        var vehicles = context.Vehicles.ToList();
        var drivers = context.Drivers.ToList();

        foreach (var tripElement in tripsElement.EnumerateArray())
        {
            var vehicleIndex = tripElement.GetProperty("vehicleIndex").GetInt32();
            var driverIndex = tripElement.GetProperty("driverIndex").GetInt32();
            var startDaysAgo = tripElement.GetProperty("startDaysAgo").GetInt32();
            var startHour = tripElement.GetProperty("startHour").GetInt32();
            var endHour = tripElement.GetProperty("endHour").GetInt32();

            var startTime = DateTime.UtcNow.AddDays(-startDaysAgo).AddHours(startHour);
            var endTime = DateTime.UtcNow.AddDays(-startDaysAgo).AddHours(endHour);

            var trip = new Trip
            {
                VehicleId = vehicles[vehicleIndex].Id,
                DriverId = drivers[driverIndex].Id,
                StartLocation = tripElement.GetProperty("startLocation").GetString()!,
                EndLocation = tripElement.GetProperty("endLocation").GetString()!,
                DistanceKm = tripElement.GetProperty("distanceKm").GetDecimal(),
                StartTime = startTime,
                EndTime = endTime,
                Purpose = tripElement.GetProperty("purpose").GetString()!
            };

            context.Trips.Add(trip);
        }

        await Task.CompletedTask;
    }

    private async Task SeedServiceRecordsAsync(FleetDbContext context, JsonElement serviceRecordsElement)
    {
        if (serviceRecordsElement.ValueKind != JsonValueKind.Array)
            return;

        var vehicles = context.Vehicles.ToList();

        foreach (var recordElement in serviceRecordsElement.EnumerateArray())
        {
            var vehicleIndex = recordElement.GetProperty("vehicleIndex").GetInt32();
            var serviceDaysAgo = recordElement.GetProperty("serviceDaysAgo").GetInt32();
            var nextServiceMonthsAhead = recordElement.GetProperty("nextServiceMonthsAhead").GetInt32();
            var serviceType = Enum.Parse<ServiceType>(recordElement.GetProperty("serviceType").GetString()!);

            var serviceRecord = new ServiceRecord
            {
                VehicleId = vehicles[vehicleIndex].Id,
                ServiceDate = DateTime.UtcNow.AddDays(-serviceDaysAgo),
                ServiceType = serviceType,
                Description = recordElement.GetProperty("description").GetString()!,
                Cost = recordElement.GetProperty("cost").GetDecimal(),
                Odometer = recordElement.GetProperty("odometer").GetInt32(),
                NextServiceDue = DateTime.UtcNow.AddMonths(nextServiceMonthsAhead),
                ServiceProvider = recordElement.GetProperty("serviceProvider").GetString()!
            };

            context.ServiceRecords.Add(serviceRecord);
        }

        await Task.CompletedTask;
    }
}
