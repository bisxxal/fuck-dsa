 
'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';

const DateButton = ({
  startDate,
  endDate
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateDateParam = (key: string, value: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, format(value, 'yyyy-MM-dd'));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-full center mt-4 !z-[2] flex-wrap gap-4 max-md:gap-2 px-4 max-md:px-0 pt-2">
      <div className="max-md:w-[120px]">
        <label className="text-[#cacaca] text-sm mr-2">Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => {
            if (date) updateDateParam('startDate', date);
          }}
          selectsStart
          calendarClassName="customclass"
          startDate={startDate}
          endDate={endDate}
          popperClassName="customclass2"
          className=" !border-2 !z-[2] border-[#ffffff60] w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1 card text-[#ffffff]"
          placeholderText="Select start date"
        />
      </div>
      <div className="max-md:w-[120px]">
        <label className="text-[#cacaca] text-sm mr-2">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => {
            if (date) updateDateParam('endDate', date);
          }}
          calendarClassName="customclass"
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          popperClassName="customclass2"
          className=" !border-2 border-[#ffffff60] w-[150px] center max-md:w-[120px] text-[#ffffff] rounded-xl px-2 py-1 card"
          placeholderText="Select end date"
        />
      </div>
    </div>
  );
};

export default DateButton;
