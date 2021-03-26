import React from 'react';
import Identify from "src/simi/Helper/Identify";

const DateFormat = (props) => {
    const { data } = props;
    const _date = new Date(data);
    const day = _date.getDate();
    let month = _date.getMonth() + 1 < 10 ? '0' + (_date.getMonth() + 1) : _date.getMonth() + 1;
    const year = _date.getFullYear();
    switch (month) {
        case '01':
            month = 'January';
            break;
        case '02':
            month = 'February';
            break;
        case '03':
            month = 'March';
            break;
        case '04':
            month = 'April';
            break;
        case '05':
            month = 'May';
            break;
        case '06':
            month = 'June';
            break;
        case '07':
            month = 'July';
            break;
        case '08':
            month = 'August';
            break;
        case '09':
            month = 'September';
            break;
        case '10':
            month = 'October';
            break;
        case '11':
            month = 'November';
            break;
        case '12':
            month = 'December';
            break;
    }

    return <span>{Identify.__(month) + ' ' + day + ', ' + year}</span>;
}

export default DateFormat;
