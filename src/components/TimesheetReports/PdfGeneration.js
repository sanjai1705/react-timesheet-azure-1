import { Divider, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const PdfGeneration = () => {
  const data = useLocation();
  console.log(data);

  const sentData = data.state;

  return (
    <div className="mx-auto">
      <div className="w-11/12 mx-auto mb-16">
        {sentData.timeentries?.map((week, weekIndex) => (
          <div className="mb-8">
            <Typography variant="h3" sx={{ textDecoration: "underline" }}>
              {new Date(
                sentData.selectedWeeks[weekIndex].start
              ).toDateString() +
                " - " +
                new Date(sentData.selectedWeeks[weekIndex].end).toDateString()}
            </Typography>
            {week.map((user, userIndex) => (
              <div className="mt-4 mb-10">
                <Typography variant="h4">
                  {sentData.userNames[userIndex]}
                </Typography>
                {user.length != 0 ? (
                  <table className="w-11/12 mx-auto border border-gray-300 text-center">
                    <thead>
                      <tr className="bg-slate-500">
                        <th className="border border-gray-300">UserId</th>
                        <th className="border border-gray-300">Date</th>
                        <th className="border border-gray-300">
                          {" "}
                          Project Name
                        </th>
                        <th className="border border-gray-300">Login Time</th>
                        <th className="border border-gray-300">Logout Time</th>
                        <th className="border border-gray-300">Hours</th>
                        <th className="border border-gray-300">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {user.map((item) => (
                        <tr>
                          <td className="border border-gray-300">
                            {item.user.userId}
                          </td>
                          <td className="border border-gray-300">
                            {item.date}
                          </td>
                          <td className="border border-gray-300">
                            {item.projectEmployee.project.projectName}
                          </td>
                          <td className="border border-gray-300">
                            {item.login}
                          </td>{" "}
                          <td className="border border-gray-300">
                            {item.logout}
                          </td>
                          <td className="border border-gray-300">
                            {item.minutes / 60}
                          </td>
                          <td className="border border-gray-300">
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr className="bg-slate-300">
                        <td colSpan="5" className="p-2 border text-right">
                          Total working hours:
                        </td>
                        <td colSpan="2" className="p-2 border text-left">
                          {user.reduce((acc, obj) => acc + obj.minutes / 60, 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <Typography variant="h5">-- No records --</Typography>
                )}
              </div>
            ))}
            <Divider />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfGeneration;
