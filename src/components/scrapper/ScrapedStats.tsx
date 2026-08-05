//import React from "react";

interface Props{
    pending:number;
    approved:number;
    rejected:number;
    today:number;
}

export default function ScrapedStats({
    pending,
    approved,
    rejected,
    today
}:Props){

    const cards=[
        {
            title:"Pending Review",
            value:pending,
            color:"yellow"
        },
        {
            title:"Approved",
            value:approved,
            color:"green"
        },
        {
            title:"Rejected",
            value:rejected,
            color:"red"
        },
        {
            title:"Today's Jobs",
            value:today,
            color:"blue"
        }
    ];

    return(

<div className="grid grid-cols-1 md:grid-cols-4 gap-5">

{cards.map(card=>(

<div
key={card.title}
className="glass-card p-5 rounded-xl">

<p className="text-gray-400 text-sm">
{card.title}
</p>

<h2 className="text-4xl font-bold mt-3">
{card.value}
</h2>

</div>

))}

</div>

);

}