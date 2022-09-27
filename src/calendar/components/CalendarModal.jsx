import { useMemo, useEffect, useState } from 'react';
import Modal from 'react-modal';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'

import DatePicker, { registerLocale } from "react-datepicker";
import { addHours, differenceInSeconds } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { useCalendarStore, useUiStore } from '../../hooks';

// registerLocale('es', es);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2 )

    })

    const titleClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ formValues.title, formSubmitted ])

    useEffect(() => {
        if ( activeEvent !== null) {
            setFormValues({ ...activeEvent });
        }
    }, [ activeEvent ])
    

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const OnDateChanged = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onCloseModal = () => {
        // console.log('cerrando modal');
        closeDateModal();
    }

    const onSubmit = async( event ) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds( formValues.end, formValues.start );
        // console.log({ difference });

        if ( isNaN ( difference ) || difference <= 0 ) {
            Swal.fire('Wrongs dates', 'Please check the input dates', 'error')
            return;
        }

        if ( formValues.title.length <= 0 ) return;

        // console.log( formValues );

        // TODO:
        await startSavingEvent( formValues );
        closeDateModal();
        setFormSubmitted( false );
        //Remove errors on the screen
        // Close the modal
    }

    return (
        <Modal
            isOpen={ isDateModalOpen }
            onRequestClose={ onCloseModal }
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={ 200 }
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={ onSubmit }>

                <div className="form-group mb-2">
                    <label>Start date and time</label>
                    <DatePicker 
                        selected={ formValues.start }
                        onChange={ (event) => OnDateChanged( event, 'start' ) }
                        className="form-control"
                        dateFormat="Pp"
                        showTimeSelect
                        // locale="es"
                        // timeCaption='Hora'
                    />
                </div>

                <div className="form-group mb-2">
                    <label>End date and time</label>
                    <DatePicker
                        minDate={ formValues.start }
                        selected={ formValues.end }
                        onChange={ (event) => OnDateChanged( event, 'end' ) }
                        className="form-control"
                        dateFormat="Pp"
                        showTimeSelect
                        // locale="es"
                        // timeCaption='Hora'
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Title and notes</label>
                    <input 
                        type="text" 
                        className={ `form-control ${ titleClass }` }
                        placeholder="Título del evento is-valid"
                        name="title"
                        autoComplete="off"
                        value={ formValues.title }
                        onChange={ onInputChanged }
                    />
                    <small id="emailHelp" className="form-text text-muted">Little description</small>
                </div>

                <div className="form-group mb-2">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ formValues.notes }
                        onChange={ onInputChanged }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Aditional information</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save</span>
                </button>

            </form>
        </Modal>
    )
}
