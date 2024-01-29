import { Divider, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const PdfGeneration = () => {
  const data = useLocation();
  console.log(data);

  const sentData = data.state;

  return (
    <div className="p-2">
        <div className="w-10/12 border-2 p-2 mx-auto mb-16 print:w-full print:border-0">
          {sentData.selectedWeeks?.map((week, weekIndex) => (
            <>
            <Typography variant="h3" sx={{ textDecoration: "underline" }}>
              {new Date(sentData.selectedWeeks[weekIndex].start).toDateString() +
                " - " +
                new Date(sentData.selectedWeeks[weekIndex].end).toDateString()}
            </Typography>

            <div className="mb-8">
              <div className="mt-4 mb-10">
                <table className="w-11/12 mx-auto border border-gray-300 text-center">
                  <thead>
                    <tr className="bg-slate-500">
                      <th className="border border-gray-300">Name</th>
                      <th className="border border-gray-300">Date</th>
                      <th className="border border-gray-300">Project Name</th>
                      <th className="border border-gray-300">Hours</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sentData.timeentries[weekIndex]?.map((item, index) => (
                      <tr>
                        <td className="border border-gray-300">
                          {item.user.firstname+ ' '+item.user.lastname}
                        </td>
                        <td className="border border-gray-300">{item.date}</td>
                        <td className="border border-gray-300">
                          {item.projectEmployee.project.projectName}
                        </td>
                        <td className="border border-gray-300">
                          {item.minutes / 60}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-slate-300">
                      <td colSpan="3" className="p-2 border text-right">
                        Total working hours:
                      </td>
                      <td colSpan="2" className="p-2 border text-left">{sentData.timeentries[weekIndex]?.reduce((acc, obj) => acc + obj.minutes/60, 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <Divider />
            </div>
          </>
          ))}
        </div>
      </div>
  );
};

export default PdfGeneration;
