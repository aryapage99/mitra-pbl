import React from 'react';
import timetableService from '../../services/timetableService';
import { COLORS } from '../../styles/colors';

const TimetableGrid = ({ timetables, selectedRoom }) => {
  if (!timetables || timetables.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: COLORS.TEXT_SECONDARY
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>No timetable data available</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>
          {selectedRoom ? 'This room has no scheduled classes' : 'Please select a room to view its timetable'}
        </div>
      </div>
    );
  }

  const { grid, timeSlots, days } = timetableService.createGridData(timetables);

  const styles = {
    container: {
      overflowX: 'auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '20px'
    },
    header: {
      marginBottom: '20px',
      borderBottom: `2px solid ${COLORS.PRIMARY}`,
      paddingBottom: '12px'
    },
    roomTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: COLORS.PRIMARY,
      marginBottom: '4px'
    },
    roomSubtitle: {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px'
    },
    th: {
      backgroundColor: COLORS.PRIMARY,
      color: '#000000',
      padding: '12px 8px',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: '14px',
      border: '1px solid #ddd',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    thTime: {
      backgroundColor: COLORS.PRIMARY,
      color: 'white',
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '14px',
      border: '1px solid #ddd',
      minWidth: '140px',
      position: 'sticky',
      left: 0,
      zIndex: 11
    },
    tdTime: {
      backgroundColor: '#f8f9fa',
      padding: '12px 16px',
      fontWeight: '600',
      fontSize: '13px',
      color: COLORS.TEXT_PRIMARY,
      border: '1px solid #ddd',
      whiteSpace: 'nowrap',
      position: 'sticky',
      left: 0,
      zIndex: 5
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
      minHeight: '60px',
      verticalAlign: 'top',
      textAlign: 'center'
    },
    emptyCell: {
      backgroundColor: '#fafafa',
      color: COLORS.TEXT_SECONDARY,
      fontSize: '12px',
      fontStyle: 'italic'
    },
    classBlock: {
      padding: '8px',
      borderRadius: '6px',
      marginBottom: '4px',
      color: 'white',
      fontSize: '13px',
      fontWeight: '500',
      lineHeight: '1.4',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    },
    programName: {
      fontWeight: '600',
      marginBottom: '2px'
    },
    legend: {
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center'
    },
    legendTitle: {
      fontWeight: '600',
      color: COLORS.TEXT_PRIMARY,
      marginRight: '8px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px'
    },
    legendColor: {
      width: '20px',
      height: '20px',
      borderRadius: '4px'
    }
  };

  const renderCell = (entries, day, timeSlot) => {
    if (!entries || entries.length === 0) {
      return (
        <td key={`${day}-${timeSlot}`} style={{ ...styles.td, ...styles.emptyCell }}>
          <div style={{ padding: '20px 8px' }}>—</div>
        </td>
      );
    }

    return (
      <td key={`${day}-${timeSlot}`} style={styles.td}>
        {entries.map((entry, idx) => {
          const color = timetableService.getProgramColor(entry.program);
          return (
            <div
              key={idx}
              style={{
                ...styles.classBlock,
                backgroundColor: color
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
              }}
              title={`${entry.program}\n${entry.room_id}\n${timetableService.formatTimeRange(entry.start_time, entry.end_time)}`}
            >
              <div style={styles.programName}>{entry.program}</div>
            </div>
          );
        })}
      </td>
    );
  };

  // Get unique program types for legend
  const programTypes = [
    { name: 'BCA Programs', color: timetableService.getProgramColor('BCA') },
    { name: 'MCA Programs', color: timetableService.getProgramColor('MCA') },
    { name: 'BSC Programs', color: timetableService.getProgramColor('BSC') },
    { name: 'MSC Programs', color: timetableService.getProgramColor('MSC') },
    { name: 'Cloud/Cyber', color: timetableService.getProgramColor('CLOUD') },
    { name: 'Elective/Honours', color: timetableService.getProgramColor('ELECTIVE') }
  ];

  return (
    <div style={styles.container}>
      {selectedRoom && (
        <div style={styles.header}>
          <div style={styles.roomTitle}>
            📍 {selectedRoom}
          </div>
          <div style={styles.roomSubtitle}>
            Weekly Timetable • {timetables.length} class sessions
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thTime}>Time Slot</th>
              {days.map(day => (
                <th key={day} style={styles.th}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => {
              const [startTime, endTime] = slot.split('-');
              return (
                <tr key={slot}>
                  <td style={styles.tdTime}>
                    {timetableService.formatTimeRange(startTime, endTime)}
                  </td>
                  {days.map(day => renderCell(grid[slot][day], day, slot))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={styles.legend}>
        <span style={styles.legendTitle}>Color Legend:</span>
        {programTypes.map((type, idx) => (
          <div key={idx} style={styles.legendItem}>
            <div style={{ ...styles.legendColor, backgroundColor: type.color }} />
            <span>{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
