(function(root){
  'use strict';
  // Prices, delivery and availability are invented examples, never a retailer feed.
  const foods=[
    {id:1186,brand:'Black Hawk',name:'Original Adult Lamb & Rice',size:'20kg',species:'Dog',target:11500,offers:[{store:'Example store A',price:11600,delivery:1200,stock:true,member:false},{store:'Example store B',price:11900,delivery:0,stock:true,member:false},{store:'Example store C',price:11000,delivery:0,stock:true,member:true}]},
    {id:1003,brand:'Advance',name:'Adult Medium Breed Chicken With Rice',size:'15kg',species:'Dog',target:12000,offers:[{store:'Example store A',price:11100,delivery:0,stock:true,member:false},{store:'Example store B',price:10900,delivery:1500,stock:true,member:false},{store:'Example store C',price:10500,delivery:null,stock:true,member:false}]},
    {id:1170,brand:'Royal Canin',name:'Maxi Ageing 8+',size:'15kg',species:'Dog',target:14000,offers:[{store:'Example store A',price:13500,delivery:0,stock:false,member:false},{store:'Example store B',price:14900,delivery:0,stock:true,member:false},{store:'Example store C',price:13900,delivery:null,stock:true,member:false}]},
    {id:976,brand:"Billie's Bowl",name:'Adult with Aussie Beef',size:'20kg',species:'Dog',target:7500,offers:[{store:'Example store A',price:7900,delivery:0,stock:true,member:false},{store:'Example store B',price:7300,delivery:1200,stock:true,member:false},{store:'Example store C',price:6900,delivery:0,stock:true,member:true}]}
  ];
  const defaults=()=>({version:1,postcode:'3799',frequency:'weekly',members:false,watches:foods.slice(0,2).map(f=>({id:f.id,target:f.target,enabled:true}))});
  function validate(s){
    if(!s||s.version!==1||!/^\d{4}$/.test(s.postcode)||!['daily','weekly'].includes(s.frequency)||typeof s.members!=='boolean'||!Array.isArray(s.watches)||s.watches.length>foods.length)throw Error('Unrecognised preview settings');
    const seen=new Set();const watches=s.watches.map(w=>{if(!w||!foods.some(f=>f.id===w.id)||seen.has(w.id)||!Number.isInteger(w.target)||w.target<100||w.target>500000||typeof w.enabled!=='boolean')throw Error('Invalid food watch');seen.add(w.id);return {id:w.id,target:w.target,enabled:w.enabled};});
    return {version:1,postcode:s.postcode,frequency:s.frequency,members:s.members,watches};
  }
  function compare(food,watch,settings,drop=false){return food.offers.map((source,i)=>{
    const price=Math.max(100,source.price-(drop&&i===0?1500:0));const delivery=settings.postcode==='3799'?source.delivery:null;const total=delivery===null?null:price+delivery;
    const reason=!source.stock?'Out of stock':source.member&&!settings.members?'Free store membership required':delivery===null?'Delivery unknown':!watch.enabled?'Watch paused':total>watch.target?'Above your target':'Meets your target';
    return {...source,price,delivery,total,eligible:reason==='Meets your target',reason};
  }).sort((a,b)=>Number(b.eligible)-Number(a.eligible)||(a.total??Infinity)-(b.total??Infinity));}
  const api={foods,defaults,validate,compare};if(typeof module==='object'&&module.exports)module.exports=api;else root.MuckaSpecials=api;
})(typeof window==='undefined'?globalThis:window);
