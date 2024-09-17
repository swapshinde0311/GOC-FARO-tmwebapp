import { toJpeg, toPng, toSvg } from 'html-to-image'

// export dashboard charts (grapecity, blocker and KPI)
export const ExportChart = (chartRef, format, fileName) => {
    try {
        if (chartRef !== null) {
            // check if chart is grapecity chart
            if (chartRef.saveImageToFile) {
                chartRef.saveImageToFile(fileName + "." + format);
            }
            // if chart is not a grapecity chart, export HTML chart DOM to image
            else if (chartRef.current !== null) {
                if (format === "png") {
                    toPng(chartRef.current, { cacheBust: true })
                        .then((dataUrl) => {
                            const link = document.createElement('a');
                            link.download = fileName + ".png";
                            link.href = dataUrl;
                            link.click();
                        })
                        .catch((error) => {
                            console.log("Error converting to png", error);
                        })
                }
                else if (format === "jpeg") {
                    toJpeg(chartRef.current, { cacheBust: true })
                        .then((dataUrl) => {
                            const link = document.createElement('a');
                            link.download = fileName + ".jpeg";
                            link.href = dataUrl;
                            link.click();
                        })
                        .catch((error) => {
                            console.log("Error convert to jpeg", error);
                        })
                }
                else if (format === "svg") {
                    toSvg(chartRef.current, { cacheBust: true })
                        .then((dataUrl) => {
                            const link = document.createElement('a');
                            link.download = fileName + ".svg";
                            link.href = dataUrl;
                            link.click();
                        })
                        .catch((error) => {
                            console.log("Error convert to svg", error);
                        })
                }
            }
        }
        else {
            console.log("invalid kpi");
        }
    } catch (error) {
        console.log(error, "Error in exportChart");
    }
}