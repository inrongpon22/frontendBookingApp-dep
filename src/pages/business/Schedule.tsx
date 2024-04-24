import { useState } from 'react';
import { dataOfWeekEng } from '../../helper/daysOfWeek';

const styleBorder = {
    borderCustomColor: {
        borderColor: '#020873'
    }
};

export default function Schedule() {
    const [daysOpen, setDaysOpen] = useState<string[]>([]);

    const isDaySelected = (dayValue: string) => {
        return daysOpen.includes(dayValue);
    };

    const toggleDay = (dayValue: string) => {
        if (isDaySelected(dayValue)) {
            setDaysOpen(daysOpen.filter((day) => day !== dayValue));
        } else {
            setDaysOpen([...daysOpen, dayValue]);
        }
    };
    return (
        <div className='mt-4 flex flex-col'>
            <p className='font-semibold' style={{ fontSize: "14px" }}>เวลาทำการ</p>
            <div className='flex justify-between mt-2'>
                {
                    dataOfWeekEng.map((day, index) => (
                        <div
                            onClick={() => toggleDay(day.value)}
                            key={index}
                            style={{ width: "45px", height: "47px", ...styleBorder.borderCustomColor }}
                            className={`${isDaySelected(day.value) ? 'border-custom-color border-2' : 'border-black-50 border'} flex items-center justify-center rounded-lg`}>
                            {day.name}
                        </div>
                    ))
                }
            </div>

        </div>
    );
}
