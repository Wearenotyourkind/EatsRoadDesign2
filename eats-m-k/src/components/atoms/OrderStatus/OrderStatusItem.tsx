import React from 'react';
import numberWithCommas from '../../../functions/addCommaFunc';

interface Props {
    item:any
}
const OrderStatusItem = ({item}:Props) => {


    return (
        <div>
            
            <div>{item.menu} X {item.count} {numberWithCommas(item.price)}원</div>

        </div>
    );
}


export default OrderStatusItem;