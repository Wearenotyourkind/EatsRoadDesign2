import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../modules';
import OrderButtonContainer from '../../atoms/OrderButton/OrderButtonContainer';
import { setStore } from '../../../modules/setStore';
import { setTable } from '../../../modules/setTable';
import StoreAndTableBoxContainer from '../../molecules/StoreAndTable/StoreAndTableBoxContainer';
import BucketButtonContainer from '../../atoms/BucketButton/BucketButtonContainer';
import { useCookies } from 'react-cookie';
import { getMenuThunk } from '../../../modules/getMenus';
import MenuListContainer from '../../molecules/MenuList/MenuListcontainer';
import { getBucketThunk } from '../../../modules/getBucket/thunks';
import { dbService } from '../../../firebase';
import { setState, setStatus } from '../../../modules/orderState';
import '../../../scss/main.scss';


const Home = ( props: any ) => {
    
    const {totalPrice, menu, state,orderStatus} = useSelector((state:RootState)=>({

        totalPrice:state.myBucket.bucket.data?.totalPrice,
        menu:state.myBase.menus.data?.menu,
        state:state.stateSet.state,
        orderStatus:state.myBucket.bucket.data?.orderStatus

    }));
    const [ cookies, setCookie, removeCookie ] = useCookies(['clientId', 'bucket']);
    const [id, setId] = useState<any>(null);
    const [ menuListState,setMenuListState ] = useState<number>(0);
    const dispatch = useDispatch();
    const today = new Date();
    const time = `[${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}]`;
    const clientId = `${today.getMonth()+1}/${today.getDate()}/${time}`;
    const query = queryString.parse(props.location.search);
    const store = query.store;
    const table = query.table

    const getStateFormFire = () => {

        dbService.collection(`${store}`).doc(`${table}`).onSnapshot(snapShot=>{

            const data = snapShot.data();
            dispatch(setState(data?.state));
            dispatch(setStatus(data?.orderStatus));

            setId(data?.clientId);

        })
    }

    const changeList = (n:number) => {

        return <MenuListContainer state={n}/>

    }

    const onCookie = () => {

        if( cookies.clientId === undefined ) {

            console.log('쿠키가 없으면 이게 나옵니다.');

            setCookie('clientId', clientId);

        
            dbService.collection(`${store}`).doc(`${table}`).update({

                'bucket':[],
                orderStatus:false,
                state:false,
                clientId:clientId,
                totalPrice:0
        
            })

        } else {

            console.log('쿠키가 있으면 이게 나오고')

            if(cookies.clientId === id ){

                console.log('전 사용자의 아이디와 현 사용자의 아이디가 같다면 이게 나옵니다.');

            } else if (cookies.clientId !== id && state) {

                console.log('전 사용자의 아이디와 현 사용자의 아이디가 다르다고 주문 접수된 상태라면 이게 나옵니다.');
                setCookie('clientId', clientId);

                dbService.collection(`${store}`).doc(`${table}`).update({

                    'bucket':[],
                    orderStatus:false,
                    state:false,
                    clientId:clientId,
                    totalPrice:0
            
                })
            }

        }
    }

    useEffect(()=>{
        
        dispatch(setStore(store));
        dispatch(setTable(table));

        if(menu === undefined) dispatch(getMenuThunk(store));
        dispatch(getBucketThunk(store, table));
        getStateFormFire();
        if(id !== null) {
            onCookie();
        }

    },[id]);

    return (
        <div>
            <StoreAndTableBoxContainer/>
            <div className="main-content">
                <div className="menulist-nav">
                    <div className="menulist-bts">
                
                        <div onClick={()=>setMenuListState(0)} style={{margin:"5px"}}>단품메뉴</div>
                        <div onClick={()=>setMenuListState(1)} style={{margin:"5px"}}>세트메뉴</div>
                        <div onClick={()=>setMenuListState(2)} style={{margin:"5px"}}>사이드메뉴</div>
                        
                    </div>
                    <BucketButtonContainer orderStatus={orderStatus}/>
                </div>

                {changeList(menuListState)}
                <OrderButtonContainer totalPrice={totalPrice}/>

            </div>
            <footer/>

           
        
    
        </div>
    );

}

export default Home;
