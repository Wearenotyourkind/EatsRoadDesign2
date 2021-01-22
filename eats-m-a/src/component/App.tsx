import React, { useEffect, useState } from 'react';
import {Button, Menu, Radio} from 'antd';
import queryString from 'query-string';
import {dbService} from '../firebase';
import '../scss/App.scss';
import NewOrderList from './NewOrderList';
import CompleteOrderList from './CompleteOrderList';
import { Table } from '../types';
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import OrderList from "./OrderList";

const App = () => {
    const query = queryString.parse(window.location.search);

    const [ newOrderList,setNewOrderList ] = useState<any>([]);
    const [ comOrderList, setComOrderList ] = useState<any>([])
    const [ state,setState ] = useState<number>(0);
    const [date, setDate] = useState<any>(new Date());
    const [page, setPage]=useState<number>(1);



    function tick() {
        let now = new Date();
        setDate(now);
    }

    const toggleCheck = (t:string) => {

        newOrderList.map((doc:Table)=>{

            if(doc.myTable === t){

                dbService.collection(`${query.store}`).doc(`${t}`).update({state:true})

            }

        })

    }


    const getOrders = (orderState:string) => {


        setComOrderList([]);
        setNewOrderList([]);



        dbService.collection(`${query.store}`)
            .orderBy(`${orderState}`)
            .onSnapshot((snapShot:any)=>{

                snapShot.forEach((doc:any)=>{
                    console.log(doc.data());

                    if(!doc.data().state && doc.data().orderStatus){
                        const tableObj : Table = {


                            myTable:doc.id,
                            orderList:doc.data().bucket,
                            orderStatus:doc.data().orderStatus,
                            state:doc.data().state,
                            totalPrice:doc.data().totalPrice

                        }
                        console.log(tableObj)
                        setNewOrderList((prev: any) => [tableObj, ...prev]);

                    } else {
                        const tableObj : Table = {
                            myTable:doc.id,
                            orderList:doc.data().bucket,
                            orderStatus:doc.data().orderStatus,
                            state:doc.data().state,
                            totalPrice:doc.data().totalPrice

                        }

                        setComOrderList((prev: any) => [tableObj, ...prev]);

                    }

                })



            });



    }

    useEffect(()=>{
        getOrders('orderAt');
        let timerID =setInterval(()=>tick(),1000);
        return function cleanUp(){
            clearInterval(timerID);
        };

    },[]);


    return (
        <div className="App">
            <div>
                <Menu className="Menu" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">
                        <h1>{query.store}</h1>
                    </Menu.Item>
                </Menu>
            </div>
            <div>
                <Link to={`/setting/?store=${query.store}`}><button>메뉴관리</button></Link>
            </div>

            <div className="orderButtonClass">

                <button className={`newOrderButton ${!state && "buttonClicked"}`} onClick={()=>{
                    setState(0);
                    setPage(1);
                }}>새로운주문</button>
                <button className={`completeOrderButton ${state && "buttonClicked"}`} onClick={()=>setState(1)}>접수완료</button>
            </div>
            <div className="infoBar">
                <div className="timer">
                    <h1>{date.toLocaleString('kr')}</h1>
                </div>

            </div>
            <hr className="infoHr"/>

            <div>
                <OrderList newTable={newOrderList} comTable={comOrderList} indexNumber={page} toggleCheck={toggleCheck}/>
            </div>
            <div className="pageButton">
                <LeftCircleOutlined className="circleButton" onClick={()=>{
                    if(page>1){
                        setPage(page-1);
                    }
                }}/>
                <h1>{page}/{Math.ceil(newOrderList.length/3)}</h1>
                <RightCircleOutlined className="circleButton" onClick={()=>{
                    if(page<newOrderList.length/3+1){
                        setPage(page+1);
                    }
                }}/>
            </div>
            <hr/>


        </div>
    );
}

export default App;