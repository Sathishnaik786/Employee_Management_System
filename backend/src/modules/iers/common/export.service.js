const logger = require('@lib/logger');

class ExportService {
    /**
     * Convert JSON data to CSV string (Dependency-free implementation).
     * @param {Array} data - Array of objects
     * @param {Array} fields - Optional specific fields to export (keys)
     * @returns {String} CSV content
     */
    async toCSV(data, fields = null) {
        try {
            if (!data || !Array.isArray(data) || data.length === 0) {
                return '';
            }

            // Determine headers
            const headers = fields || Object.keys(data[0]);

            // Create CSV rows
            const csvRows = [
                headers.join(','), // header row
                ...data.map(row =>
                    headers.map(fieldName => {
                        const cellValue = row[fieldName] !== undefined ? row[fieldName] : '';
                        const escaped = ('' + cellValue).replace(/"/g, '""'); // Escape double quotes
                        return `"${escaped}"`; // Wrap in quotes
                    }).join(',')
                )
            ];

            return csvRows.join('\n');
        } catch (error) {
            logger.error('Error exporting to CSV', { error: error.message });
            throw new Error('Failed to generate CSV export');
        }
    }
}

module.exports = new ExportService();
