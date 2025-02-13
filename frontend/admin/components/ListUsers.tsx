import React,{useState, useEffect} from 'react';
import axios from 'axios';

interface User{
    id: number;
    name: string;
    email: string;
}