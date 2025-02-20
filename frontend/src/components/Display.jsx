import React from 'react'
import Card from '../components/Card'

export default function Display({ currentPhone }) {
    return (
        <div className='container'>
            {/* {currentPhone && currentPhone.map((phone) => (
                <Card key={phone._id} phone={phone}/>
            ))} */}
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
        </div>
    )
}
