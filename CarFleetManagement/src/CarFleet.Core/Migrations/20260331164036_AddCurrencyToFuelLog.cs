using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarFleet.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrencyToFuelLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "FuelLogs",
                type: "text",
                nullable: false,
                defaultValue: "USD");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "FuelLogs");
        }
    }
}
