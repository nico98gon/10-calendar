import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal } from "../store"

export const useUiStore = () => {

    const dispatch = useDispatch();

    const {
        isDateModalOpen
    } = useSelector( state => state.ui );

    const openDateModal = () => {
        dispatch( onOpenDateModal() );
    }

    const closeDateModal = () => {
        dispatch( onCloseDateModal() );
    }

    const toggleDataModal = () => {
        ( isDateModalOpen )
        ? openDateModal()
        : closeDateModal();
    }

    return {
        // *propiedades
        isDateModalOpen,
        
        //* Métodos
        openDateModal,
        closeDateModal,
        toggleDataModal
    }
}
