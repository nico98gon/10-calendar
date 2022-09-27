import { useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// yarn add date-fns

// import format from 'date-fns/format'
// import parse from 'date-fns/parse'
// import startOfWeek from 'date-fns/startOfWeek'
// import getDay from 'date-fns/getDay'
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from "../";
import { getMessagesES, localizer } from '../../helpers';
import { useUiStore,  useCalendarStore } from '../../hooks';

export const CalendarPage = () => {
    
    const { events, setActiveEvent } = useCalendarStore();
    const { openDateModal } = useUiStore();
    const [ lastView, setLastView ] = useState( localStorage.getItem('lastView') || 'week' );
    
    const eventStyleGetter = ( event, start, end, isSelected ) => {
        // console.log({ event, start, end, isSelected });

        const style = {
            backgroundColor: '#347CF7',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }

        return{
            style
        }
    }

    const onDoubleClick = () => {
        // console.log({ doubleClick: event });
        openDateModal();
    }

    const onSelect = ( event ) => {
        // console.log({ click: event });
        setActiveEvent( event );
    }

    const onViewChanged = ( event ) => {
        localStorage.setItem('lastView', event);
        setLastView( event ); // this line is not strictly necessary
    }

    return (
        <>
            <NavBar />

            <Calendar
                // culture='es'
                localizer={ localizer }
                events={ events }
                defaultView={ lastView }
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px )' }}
                eventPropGetter={ eventStyleGetter }
                // messages={ getMessagesES() }
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelect }
                onView={ onViewChanged }
            />

            <CalendarModal />
            <FabAddNew />
            <FabDelete />

        </>
    )
}
