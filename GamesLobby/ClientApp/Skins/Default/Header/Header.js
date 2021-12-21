import './_header.scss';

import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { currency } from '../../../Lib/Common/currency';
import { Icon } from '../../../Components/Icon/Icon';

export const Header = () => {
    const [time, setTime] = useState(new Date());
    var interval = null;

    useEffect(() => {
        setInterval(() => setTime(new Date()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return <header>
        <div className='flex padding-top padding-bottom'>
            <div className='balance align-right'>
                <span>$</span>{currency(1000, '')}
            </div>
            <div className='time'>
                <Icon icon='clock' /><span>{time.toLocaleTimeString('en-Gb')}</span>
            </div>
        </div>
        <nav>
            <img className='brand' src='http://cdn-d.tentangle.com/CuriousApps/brand/logo-small.png' />
            <NavLink to='/roaches'><span>Cockroach Racers</span><img className='cockrach-img' src='img/cockrach.png' alt="cockrach" /><span>01.07</span> </NavLink>
            <NavLink to='/robo-dogs'><span>Robo Dogs</span><img className='nav-dog-img' src='img/dog.png' alt="dogs" /><span> 03.27 </span> </NavLink>
            <NavLink to='/bikes'><span>Torn Bikers</span><img className='nav-bike-img' src='img/bike.png' alt="bikes" /><span> 02.27 </span> </NavLink>
            {/* <NavLink to='/robo-dogs'><span>Robo Dogs</span></NavLink> */}
        </nav>
    </header>;
};
export default Header;