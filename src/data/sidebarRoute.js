const sideBarRoute = {
    Employee: {
        dashboard: '/e/',
        timeentries: '/e/timeentries',
        viewtimesheet: '/e/viewtimesheet',
        calendar: '/e/calendar'
    },
    Manager: {
        dashboard: '/m/',
        timeentries: '/m/timeentries',
        viewtimesheet: '/m/viewtimesheet',
        approvals: '/m/approvals',
        calendar: '/m/calendar',
        timesheetreports: '/m/timesheetreports'
    },
    Admin: {
        dashboard: '/admin/',
        timeentries: '/admin/timeentries',
    }
}

export default sideBarRoute