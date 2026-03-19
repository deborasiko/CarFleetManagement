using Microsoft.EntityFrameworkCore;
using CarFleet.Core.Models;
using CarFleet.Core.Data;

namespace CarFleet.Core.Repositories;

public class DocumentRepository : Repository<Document>, IDocumentRepository
{
    public DocumentRepository(FleetDbContext context) : base(context) { }

    public async Task<IEnumerable<Document>> GetDocumentsForVehicleAsync(int vehicleId)
    {
        return await DbSet
            .Where(d => d.VehicleId == vehicleId)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Document>> GetExpiringDocumentsAsync(int daysUntilExpiry)
    {
        var expiryDate = DateTime.UtcNow.AddDays(daysUntilExpiry);
        return await DbSet
            .Where(d => d.ExpiryDate != null && d.ExpiryDate <= expiryDate && d.ExpiryDate > DateTime.UtcNow)
            .Include(d => d.Vehicle)
            .OrderBy(d => d.ExpiryDate)
            .ToListAsync();
    }
}
