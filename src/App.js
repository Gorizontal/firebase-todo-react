import React from 'react';
import Header from './component/header/header';
import InputSubmit from './component/input-submit/input-submit';
import FilterItem from './component/filter-list/filter-item';
import ToDoList from './component/todo-list/todo-list';
import { set, ref, onValue, remove, update } from 'firebase/database';
import {useState, useEffect} from "react";
import {uid} from 'uid';
import { getStorage,uploadBytes, ref as refST   } from "firebase/storage";



import './App.css';

import { db } from './database';


/**
  * writeDataBase - записывает наше дело делает проверки, обновляет стейт компонентов, что бы в инпутах не оставался текст
  * 
  * useEffect - работает как didMount и didUpdate, принимает данные с сервера и обновляет стейт массивом объектов с денными нашего дела
  * 
  * search - функция для поиска. принимает данные из ипута фильтра и наш массив объектов. выозвращает новый отфильтрованный массив
  * 
  * filterI - принимает в себя функцию search. тоесть отфильтрованный массив объектов, и ещё один аргумент Это значение нащего фильтра кнопки.
  * возвращает новый массив visibleItems который затем передаётся в todo-item
  * 
  * 
  * uploadFile - загружает файлы на сервер
  */

function App() {
  const storage = getStorage();


  const [todoData, setTodoData] = useState([])
  const [headValue, setHeadValue] = useState('')
  const [bodyValue, setBodyValue] = useState('')
  const [dateValue, setDateValue] = useState('')
  const [changeToggle, setChangeToggle] = useState(false)
  const [idUpdate, setIdUpdate] = useState('')
  const [valueInpFilter, setValueInpFilter] = useState('')
  const [filter, setFilter] = useState('')
  const [file1, setFile1] = useState('')




  const writeDataBase =  (e)=>{
    e.preventDefault()
    const file = e.target[0].files[0] ;
    if(file){
      const ID = uid()


      if(headValue && bodyValue && dateValue)
      { set(ref(db, `${ID}` ),{
        ID: ID,
        headValue,
        bodyValue,
        dateValue,
        complete: false,
        important: false,
        late: false,
        path: true,
        filename: file.name
      });
      
      uploadFile(file, ID)
      setHeadValue('')
      setBodyValue('')
      setDateValue('')
      setFile1(file.name)
      }}
    else{
      if(headValue && bodyValue && dateValue)
      {
        const ID = uid()
        set(ref(db, `${ID}` ),{
        ID: ID,
        headValue,
        bodyValue,
        dateValue,
        complete: false,
        important: false,
        late: false,
        path: false,
        filename: null
      });
      setHeadValue('')
      setBodyValue('')
      setDateValue('')
    }

}}

const getHeadValue =(value)=>{
  setHeadValue(value.target.value)
}
const getBodyValue =(value)=>{
  setBodyValue(value.target.value)
}
const getDateValue = (value) =>{
  setDateValue(value.target.value)
}


useEffect(()=>{ 
  onValue(  ref(db), snapshot =>{
    setTodoData([]);
    const data = snapshot.val(); 
    if(data !== null){
      const items = Object.values(data)
    setTodoData(items);
      }
    } 
  )  
},[])




const deleteItem = (ID) =>{
  remove(ref(db, `/${ID}`))
}

const changeUpdate=({headValue, bodyValue, dateValue, ID })=>{
    setIdUpdate(ID)
    setChangeToggle(true);
    setHeadValue(headValue);
    setBodyValue(bodyValue);
    setDateValue(dateValue);
}

const changeItem=()=>{
  update(ref(db, `/${idUpdate}`), {
    headValue,
    bodyValue,
    dateValue
  });
  
  setHeadValue('')
  setBodyValue('')
  setDateValue('')
  setChangeToggle(false)
}

const toggleClose=()=>{
  setHeadValue('')
  setBodyValue('')
  setDateValue('')
  setChangeToggle(false)
}

const valueFilter =(e)=>{
  setValueInpFilter(e.target.value)
}

const search =(todoData, valueInpFilter)=>{
 
  if(valueInpFilter.length === 0){
    return todoData
  }

  return todoData.filter((itmObj)=>{
    let searchTXT = itmObj.bodyValue.toLowerCase() + itmObj.headValue.toLowerCase() + itmObj.dateValue;
    return searchTXT.indexOf(valueInpFilter.toLowerCase()) > -1

  })
 
}

const filterI=(items, filter)=>{

  if(filter === 'all'){
   return items
  } 
  if(filter === 'active'){
    return items.filter((el)=>{return el.complete=== false})
  }
  if(filter === 'done'){
    return items.filter((el)=>{return el.complete=== true})
  }
  if(filter === 'important'){
    return items.filter((el)=>{return el.important=== true})
  }
  if(filter === 'late'){
    return items.filter((el)=>{return el.late=== true})
  }

  return items
}

const visibleItems =  filterI(search(todoData, valueInpFilter), filter)

const toggleStatusFilter =(name)=>{
  setFilter(name)
}



const uploadFile = (file, ID)=>{
  if(!file){
     return
  }
  const storageRef = refST(storage, `${ID}/${file.name}`);
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}


  return (
       <div className='appWrapper'>
            <Header/>
            <InputSubmit writeDataBase = {writeDataBase}
                         getHeadValue={getHeadValue} 
                         getBodyValue={getBodyValue}
                         getDateValue={getDateValue}
                         headValue={headValue}
                         bodyValue={bodyValue}
                         dateValue={dateValue}
                         changeToggle={changeToggle}
                         changeItem={changeItem}
                         toggleClose={toggleClose}
                         uploadFile={uploadFile}
                           />
            <ToDoList todoData={visibleItems}
                      deleteItem={deleteItem}
                      changeUpdate={changeUpdate}
                      />
            <FilterItem todoData={todoData}
                        valueFilter={valueFilter}
                        valueInpFilter={valueInpFilter}
                        filter={filter} 
                        toggleStatusFilter={toggleStatusFilter} />
       </div>
  );
}

export default App;
