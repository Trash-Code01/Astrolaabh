import { ArrowRight, Check } from 'lucide-react';
import { configuredGemstone, metals, settingForms } from '../../lib/configuredGemstone';
import { gemstones } from '../../lib/gemstones';
import { navigateToCart } from '../../lib/navigation';
import { useCartStore } from '../../store/useCartStore';
import type { SettingChoice } from './settingTray';

const stone = gemstones.find(gemstone => gemstone.id === 'yellow-sapphire')!;

type SettingProps = {choice: SettingChoice; onChange: (choice: SettingChoice) => void};
export function SettingOptions({choice,onChange}: SettingProps) {
  return <>
    <fieldset><legend>Setting</legend><div className="rec-options">
      {settingForms.map(form => <label key={form}>
        <input type="radio" name="pukhraj-setting" checked={choice.form === form} onChange={() => onChange({...choice, form})}/>
        <span>{form}</span>
      </label>)}
    </div></fieldset>
    <fieldset><legend>Metal</legend><div className="rec-options">
      {metals.map(option => <label key={option.id}>
        <input type="radio" name="pukhraj-metal" checked={choice.metalId === option.id} onChange={() => onChange({...choice, metalId: option.id})}/>
        <span><i style={{backgroundColor:option.color}}/>{option.name}</span>
      </label>)}
    </div></fieldset>
  </>;
}

export function SettingShop({ choice, onChange }: SettingProps) {
  const metal = metals.find(option => option.id === choice.metalId)!;
  const { product, colorway } = configuredGemstone(stone, metal, choice.form);
  const addItem = useCartStore(state => state.addItem);
  const inBag = useCartStore(state => state.items.some(item => item.product.id === product.id));
  return <div className="rec-shop">
    <SettingOptions choice={choice} onChange={onChange}/>
    <div className="rec-buy"><span>From <strong>{stone.price}</strong></span>
      {inBag ? <button className="rec-primary" onClick={navigateToCart}><Check size={15}/> View bag <ArrowRight size={14}/></button>
      : <button className="rec-primary" onClick={()=>addItem(product,colorway,1)}>Add to bag <ArrowRight size={14}/></button>}
    </div>
    <div className="rec-shop-links"><a href="/product/yellow-sapphire">Stone details</a><a href="/find-gem#consultation">Ask an advisor</a></div>
    <span className="sr-only" role="status">{inBag ? `${product.name} in ${metal.name} is in your bag.` : ''}</span>
  </div>;
}
