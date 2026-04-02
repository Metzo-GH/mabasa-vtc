import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarView.css';

export default function CalendarView({ bookings = [], onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // start from monday = 0
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  // Map dates to bookings
  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      if (!b.pickup_date) return;
      const dateKey = b.pickup_date;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(b);
    });
    return map;
  }, [bookings]);

  const renderCells = () => {
    const cells = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayBookings = bookingsByDate[dateStr] || [];
        const isToday = dateStr === todayStr;

        cells.push(
            <div 
              key={d} 
              className={`calendar-cell ${isToday ? 'today' : ''} ${dayBookings.length > 0 ? 'has-booking' : ''}`}
            >
                <div className="calendar-cell-header">
                  <span className="calendar-day-num">{d}</span>
                </div>
                <div className="calendar-events">
                  {dayBookings.map((b, idx) => (
                    <div 
                      key={b.id || idx} 
                      className={`calendar-event status-${b.status}`}
                      onClick={() => onSelectDate && onSelectDate(dateStr)}
                      title={`${b.first_name} ${b.last_name} - ${b.departure} vers ${b.arrival}`}
                    >
                      <span className="event-time">{b.pickup_time ? b.pickup_time.slice(0, 5) : ''}</span>
                      <span className="event-name">{b.first_name} {b.last_name?.charAt(0)}.</span>
                    </div>
                  ))}
                </div>
            </div>
        );
    }
    return cells;
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  return (
    <div className="calendar-module">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={prevMonth} className="btn-icon"><ChevronLeft /></button>
          <h2>{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={nextMonth} className="btn-icon"><ChevronRight /></button>
        </div>
        <button onClick={todayMonth} className="btn btn-secondary btn-sm">Aujourd'hui</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day-name">Lun</div>
        <div className="calendar-day-name">Mar</div>
        <div className="calendar-day-name">Mer</div>
        <div className="calendar-day-name">Jeu</div>
        <div className="calendar-day-name">Ven</div>
        <div className="calendar-day-name">Sam</div>
        <div className="calendar-day-name">Dim</div>
        {renderCells()}
      </div>
    </div>
  );
}
