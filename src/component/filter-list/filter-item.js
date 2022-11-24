import React from "react";
import './filter-item.css'

/**
  * компонент выполняет фильтрацию всех назначенных дел
  * происходит генерация кнопок с учётом имени. 
  * 
  * в props переданы :
  * 1)valueInpFilter значение в инпуте фильтра для поиска
  * 2)valueFilter функция, передаём в app с её помощью значение инпута и обновляем там стейт
  * 3)filter приходит из стейта в App.js для определения раздела задачи (выполнено, просрочено и тд)
  * 4)toggleStatusFilter функция с помощью которой обновляем стейт в App по filter
  */

const FilterItem =(props)=>{
    const {valueInpFilter, valueFilter, filter, toggleStatusFilter} = props;
    


    const buttonName = [
        {name: 'all', label: 'Все задачи'},
        {name: 'important', label: 'Важные'},
        {name: 'active', label: 'Активные'},
        {name: 'done', label: 'Выполненные'},
        {name: 'late', label: 'Просроченные'},
        
    ]

    const button = buttonName.map(({name, label})=>{
        const active = filter === name                          
        const classs = active ? 'btnActive' : 'btnPassive'
        return(
            <button className={classs} key={name} onClick={()=>{toggleStatusFilter(name)}}>{label}</button>
        )
    })


    return(

        <div className="filterWrapper">
            <input type="text" onChange={(e)=> valueFilter(e)} value={valueInpFilter}  placeholder="поиск дел"/>
      {button}
        </div>

    )
}

export default FilterItem;