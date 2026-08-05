export interface Company {

    id:number;
    name:string;
    logo:string;
    hr:string;
    email:string;
    industry:string;
    status:string;

}

export const companies:Company[]=[

{
id:1,
name:"Microsoft",
logo:"https://logo.clearbit.com/microsoft.com",
hr:"Anjali Sharma",
email:"campus@microsoft.com",
industry:"Software",
status:"Never Contacted"
},

{
id:2,
name:"Amazon",
logo:"https://logo.clearbit.com/amazon.com",
hr:"Rahul Gupta",
email:"recruitment@amazon.com",
industry:"Cloud",
status:"Pending"
},

{
id:3,
name:"Adobe",
logo:"https://logo.clearbit.com/adobe.com",
hr:"Sneha Das",
email:"campus@adobe.com",
industry:"Software",
status:"Replied"
},

{
id:4,
name:"Google",
logo:"https://logo.clearbit.com/google.com",
hr:"Riya Sen",
email:"campus@google.com",
industry:"Software",
status:"Never Contacted"
}

];