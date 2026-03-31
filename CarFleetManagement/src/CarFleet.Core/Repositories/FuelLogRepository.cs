using Microsoft.EntityFrameworkCore;
using CarFleet.Core.Models;
using CarFleet.Core.Data;

namespace CarFleet.Core.Repositories;

public class FuelLogRepository : Repository<FuelLog>, IFuelLogRepository
{
    public FuelLogRepository(FleetDbContext context) : base(context) { }

    public async Task<IEnumerable<FuelLog>> GetFuelLogsForVehicleAsync(int vehicleId)
    {
        return await DbSet
            .Where(fl => fl.VehicleId == vehicleId)
            .OrderByDescending(fl => fl.FuelDate)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalFuelCostAsync(int vehicleId, DateTime startDate, DateTime endDate)
    {
        return await DbSet
            .Where(fl => fl.VehicleId == vehicleId && fl.FuelDate >= startDate && fl.FuelDate <= endDate)
            .SumAsync(fl => fl.TotalCost);
    }

    public async Task<decimal> GetAverageFuelConsumptionAsync(int vehicleId)
    {
        var logs = await DbSet
            .Where(fl => fl.VehicleId == vehicleId && fl.Odometer.HasValue && fl.Odometer > 0)
            .ToListAsync();

        if (logs.Count == 0) return 0;

        // Calculate individual consumption for each log and return average (L/100km)
        decimal totalConsumption = 0;
        int validLogs = 0;

        foreach (var log in logs)
        {
            // Consumption = (Liters * 100) / Odometer
            var consumption = (log.Liters * 100) / log.Odometer!.Value;
            totalConsumption += consumption;
            validLogs++;
        }

        return validLogs > 0 ? totalConsumption / validLogs : 0;
    }
}
