import React from 'react'
//Checkbox Volé honteusement sur un site random

export const CheckBox = props => {
    return (
      <div>
       <input key={props.id} onChange={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.value} /> {props.value}
      </div>
    )
}

export default CheckBox