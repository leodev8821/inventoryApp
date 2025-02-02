import React, { useContext } from 'react';
import { LopdContext } from '../../utils/context/LopdContext';
import Input from './Input';

const Checkbox = (props) => {
    const { acceptLopd, toggleLopd } = useContext(LopdContext);
    
    return (
        <div className="Checkbox__Container">
        <Input
            type="checkbox"
            id="lopd"
            name="lopd"
            required
            checked={acceptLopd}
            onChange={toggleLopd}
            {...props}
        />
        <a href="/lopd" className="Checkbox__Container--link">
            Acepto términos y condiciones
        </a>
        </div>
    );
};

export default Checkbox;