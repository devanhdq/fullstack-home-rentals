import React from 'react';

import {IconButton} from "@mui/material";
import {Search} from "@mui/icons-material";
import '../styles/Navbar.scss';
import variable from '../styles/variables.scss';

const Navbar = () => {
    return (
        <div className="navbar">
            <a href="/">
                <img src="/assets/logo.png" alt="logo"/>
            </a>
            <div className="navbar_search">
                <input type="text" placeholder="Search..."/>
                <IconButton>
                    <Search sx={{color:variable.pinkred}}/>
                </IconButton>
            </div>
        </div>
    );
};

export default Navbar;