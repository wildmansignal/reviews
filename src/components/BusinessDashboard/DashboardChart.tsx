import React from 'react';

interface DashboardChartProps {
    data: number[];
    secondaryData?: number[]; // Gray background line
    height?: number;
    color?: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
    data,
    secondaryData,
    height = 100,
    color = '#635bff'
}) => {

    // Normalization logic to fit data into SVG 0-100 coordinate space
    const normalize = (val: number, min: number, max: number) => {
        if (max === min) return 50; // Flat line
        return 100 - ((val - min) / (max - min)) * 80; // keep some padding, invert Y
    };

    const createPath = (dataset: number[]) => {
        if (!dataset || dataset.length === 0) return "";
        const max = Math.max(...dataset, 1);
        const min = Math.min(...dataset, 0);

        const stepX = 100 / (dataset.length - 1);

        return dataset.map((val, i) => {
            const x = i * stepX;
            const y = normalize(val, min, max);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    const pathD = createPath(data);
    const secondaryPathD = secondaryData ? createPath(secondaryData) : "";

    return (
        <div className="bd-chart-container" style={{ height }}>
            <svg
                className="bd-chart-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {/* Secondary line (gray/previous period) */}
                {secondaryPathD && (
                    <path
                        d={secondaryPathD}
                        className="bd-chart-path-secondary"
                    />
                )}

                {/* Primary line (purple/current) */}
                <path
                    d={pathD}
                    className="bd-chart-path"
                    style={{ stroke: color }}
                />
            </svg>
        </div>
    );
};

export default DashboardChart;
