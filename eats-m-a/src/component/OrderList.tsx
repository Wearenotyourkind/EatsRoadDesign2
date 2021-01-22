import React, {useState} from 'react';
import queryString from "query-string";
import Order from "./Order";
import {Card, Col} from "antd";


interface Props {
    comTable:any
    newTable:any
    toggleCheck:(t:string)=>void
    indexNumber:number

}

const OrderList=({comTable,newTable,toggleCheck,indexNumber}:Props)=>{
    const query = queryString.parse(window.location.search);
    const [select,setSelect] = useState<any>();
    const [popoverVisible,setPopoverVisible]=useState<any>({tableNum:0,visible:false});

    let table:any=[...newTable,...comTable];

    table.sort((a:any,b:any)=>{
        return a.myTable<b.myTable ? -1:a.myTable>b.myTable? 1:0;
    })
    console.log(table);

    console.log(table)
    return(
        <>
            {

                table.map((m:any)=>{
                    return(

                        <Col span={8}>
                            <Card className="orderCard" >
                                <h1>{`${m.myTable}번 테이블`}</h1>
                                <Order orders={m.orderList}/>
                            </Card>
                        </Col>
                    )
                })
            }
        </>
    )
}

export default OrderList;