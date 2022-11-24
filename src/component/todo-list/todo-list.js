import React, {useState} from "react";
import "./todo-list.css"
import {  ref,  update } from 'firebase/database';
import { db } from "../../database";
import { getStorage,  ref as refST ,getDownloadURL } from "firebase/storage";


/**
  * компонент отображает список дел, после доавления
  * *todoData - приходит из props в App.js это массив объектов списка наших дел с сервера
  * 
  * sendComplete - функция в onClick, при нажатии обновляем компонент меняя свойство complete. Далее меняются стили. (ВЫПОЛНЕНО)
  * sendImportant - функция в onClick, при нажатии обновляем компонент меняя свойство important. Далее меняются стили. (ВАЖНО)
  * changeUpdate - функция в onClick, приходит из Props,  обновляет стейт инпутов для изменения дела из списка (Изменить)
  * deleteItem - функция в onClick, приходит из Props, удаляет элемент из списка (Удалить)
  * 
  * styles,styleWrap - стили
  * 
  * later - фильтрует данные по дате, определяет какие дела просрочены
  * 
  * *getDownloadURL - промис, отдаёт нам ссылку на скачивание файла.  Обновляет стейт urll
  */





const ToDoList = (props)=>{

    const [urll, setUrll] = useState('')
    const {todoData, deleteItem, changeUpdate} = props;
    const storage = getStorage();

    const dayjs = require('dayjs')
    let day =  dayjs().format('YYYY-MM-DD')

/// СТИЛИ
    const styles = ({important, complete}) => {
        return {
            fontSize: important ? '1.3rem' : '1rem',
            color: important ? 'green' : 'black', 
            fontWeight: important ? 'bold' : 'normal',
            textDecoration: complete ? 'line-through' : 'none',
        }
    }

    const styleWrap = ({late, important})=>{
        return {
            border: important ? '6px #30c725 solid' : '2px #30c725 solid',
            background: late ? 'tomato' : 'none',
        }
      }

    const  later = todoData.map((itemObj)=>{
        if(day > itemObj.dateValue){
            update(ref(db, `/${itemObj.ID}`), {
                late: true
              });
            return {...itemObj, late: true}
            } else {return {...itemObj}
        }
    })
     
    // делаем ВАЖНО
    const sendImportant=({ID, important, dateValue})=>{
        update(ref(db, `/${ID}`), {
          important: !important
        }); 
      }

  // делаем выполнено
      const sendComplete = ({ID, complete}) =>{
        update(ref(db, `/${ID}`), {
          complete: !complete
        });
      }

    const items = later.map((itemObj)=>{
        const {bodyValue, headValue, dateValue, filename, ID, path} = itemObj;
        const starsRef = refST(storage, `${ID}/${filename}`);   
        getDownloadURL(starsRef).then((url) => {
            setUrll(url)
      })      

        return (
            <div className="todoListWrapper" style ={styleWrap(itemObj)} key={ID}>
                <div className="itemHeadWrap">
                    <h3 className="itemHead">{bodyValue}</h3>
                    <span className="textItem">{dateValue}</span>
                </div>
                <div className="itemWrapper">
                    <span className="textItem"  style = {styles(itemObj)}>{headValue}</span>
                    <div className="btnTodoWrap">
                        <button onClick={()=>{sendComplete(itemObj)}}>выполнено</button>
                        <button onClick={()=>{sendImportant(itemObj)}}>!</button>
                        <button onClick={()=>{changeUpdate(itemObj)}}>изменить</button>
                        <button onClick={()=>{deleteItem(ID)}}>удалить дело</button>
                        {path ? (
                            <a href={urll} download >скачать файл</a>
                        ) : <div>нет файлов</div>}
            
                    </div>
                </div>
            </div>
        )
    })
    
    return(
        <div className="todoWrapper">
            {items}
        </div>
    )
}

export default ToDoList