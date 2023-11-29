const sideBarRoute = {
    Employee: {
        dashboard: '/employee/',
        timeentries: '/employee/timeentries',
        viewtimesheet: '/employee/viewtimesheet',
        calendar: '/employee/calendar'
    },
    Manager: {
        dashboard: '/manager/',
        timeentries: '/manager/timeentries',
        viewtimesheet: '/manager/viewtimesheet',
        approvals: '/manager/approvals',
        calendar: '/manager/calendar'
    },
    Admin: {
        dashboard: '/admin/',
        timeentries: '/admin/timeentries',
    }
}

export default sideBarRoute