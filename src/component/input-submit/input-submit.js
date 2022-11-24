import React from "react";
import {useState} from "react";


import "./input-submit.css"

/**
  * компонент выполняет назначения дела.
  * Задаём параметры дела. Заголовок, описание, дата, прикрепление файлов, редактирование задачи
  * 
  * headValue - значение Заголовка, меняется в стейте в App.js
  * bodyValue - значение описания, меняется в стейте в App.js
  * dateValue - значение Даты, меняется в стейте в App.js
  * 
  * getHeadValue - функция, обновляем с её помощью стейт 
  * getBodyValue - функция, обновляем с её помощью стейт 
  * getDateValue - функция, обновляем с её помощью стейт 
  * 
  * changeToggle - определяем была ли нажата кнопка изменить, меняется в стейте в App.js
  * changeItem - определяем сохранять ли изменения в задаче.  меняется в стейте в App.js
  * toggleClose - если передумали вносить изменения, закрывает на крестик форму изменения.  меняется в стейте в App.js
  * 
  * valInp, setValInp - для того, что бы из инпута ри выборе файла исчезало название. 
  */

const InputSubmit = (props)=>{

    const {headValue,bodyValue,dateValue,getHeadValue,getBodyValue,getDateValue, changeToggle,changeItem,toggleClose} = props;
    const [valInp, setValInp] = useState('')
    const getInp =(e)=>{
        setValInp(e.target.value)
    }

    return (
        <div >
            <div className="inputSubWrapper">
                <input className="inpSubm" type="text" placeholder="Заголовок" onChange={(value)=> getBodyValue(value)} value={bodyValue}/>
                <input type="text" placeholder="опиши задачу" onChange={(value)=> getHeadValue(value)} value={headValue}/>
                <label htmlFor="start">Выберите дату</label>
                <input type="date" id="start"  onChange={(value)=> getDateValue(value)} value={dateValue} min="2022-23-11" max="2025-12-31"></input>
                    {changeToggle ? (         
                        <span>
                            <button onClick={changeItem}>Сохранить изменения?</button>
                            <button onClick={toggleClose}>X</button>
                        </span>):( 
                        <div>
                            <form onSubmit={(e)=> {setValInp(''); return props.writeDataBase(e)}}>
                                <input type="file" onChange={getInp} value={valInp}/>
                                <button type="submit" >назначить дело</button>
                            </form>

                         </div>
                     )}
            </div >
        </div>
    )
}

export default InputSubmit