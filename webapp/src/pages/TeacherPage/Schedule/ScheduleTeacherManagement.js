import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Layout from '../../../components/Teacher/Layout';
import axios from '../../../api/axios';
import moment from 'moment';

const ScheduleTeacherManagement = () => {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.user_id;
    try {
      const response = await axios.get('/class/all');
      const filteredData = response.data.filter(
        (cls) => cls.user_id === userId
      );
      let allEvents = [];
      filteredData.forEach((cls) => {
        allEvents = allEvents.concat(generateRecurringEvents(cls));
      });
      setEvents(allEvents);
      console.log(allEvents);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const generateRecurringEvents = (cls) => {
    let events = [];
    let startDate = moment(cls.date_start);
    let endDate = moment(cls.date_finish);
    let current = startDate.clone().day(cls.day_of_week % 7);
    if (current.isBefore(startDate, 'day')) {
      current.add(1, 'weeks');
    }

    while (current.isSameOrBefore(endDate)) {
      const eventDateStr = current.clone().format('YYYY-MM-DD');
      events.push({
        id: `${cls.class_id}-${eventDateStr}`,
        title: `${cls.course_name} (${cls.class_code})`,
        start: current.clone().format('YYYY-MM-DD') + 'T' + cls.time_start,
        end: current.clone().format('YYYY-MM-DD') + 'T' + cls.time_finish,
        allDay: false,
      });
      current.add(1, 'weeks');
    } 

    return events;
  };

  const handleEventClick = (clickInfo) => {
    const classId = clickInfo.event.id.split('-')[0];
    navigate(`/teacher/attendance/classDetail/${classId}`);
  };
  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Schedule</h4>
        <div className="mt-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventColor="blue"
            eventClick={handleEventClick}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ScheduleTeacherManagement;
