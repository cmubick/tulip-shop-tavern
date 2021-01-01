import React, { useState } from "react";
import ResponsiveModal from "react-responsive-modal";
import '../App.css';
import { Controller, useForm } from "react-hook-form";
import { useCookies } from 'react-cookie';
import axios from 'axios'
import config from '../config';

const url = `${config.domains.api}`;
const types = [
    { value: "draft", label: "Draft" },
    { value: "tallboy", label: "Tallboy" },
    { value: "cider", label: "Cider" },
    { value: "wine", label: "Wine" },
    { value: "sandwich", label: "Sandwich" },
    { value: "addon", label: "Add-On" },
    { value: "side", label: "Side" },
    { value: "salad", label: "Salad" },
    { value: "sauce", label: "Sauce" },
    { value: "house-drink", label: "House Drink" },
    { value: "classic-drink", label: "Classic Drink" },
    { value: "hot-drink", label: "Hot Drink" }
  ];

const styles = {
  modal: {
    backgroundColor: "transparent",
    boxShadow: "none",
    display: "flex",
    overflow: "none",
    width: "100%",
    padding: "0",
    margin: "0",
    height: "100%",
    minWidth: "100%",
    justifyContent: "center",
    zIndex: 50000
  },
  overlay: {
    backgroundColor: "#1cccc",
    padding: 0
  },
  closeIcon: {
    fill: "#fff"
  }
};

const SearchOverlay = props => {
  const { setModalVisible, modalVisible, item } = props;
  const { control, handleSubmit } = useForm();
  const [cookies] = useCookies(['serverless']);
  axios.defaults.headers.common['Authorization'] = `Bearer ${cookies?.serverless?.userToken}`;
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  const onSubmit = (data) => {
    data.item.id = data.id;;
    if(data.item.id){
      const apiUrl = `${url}/items/update`;
      axios.post(apiUrl, data.item).then((response) => {
          console.log("update response", response);
          window.location.replace('/admin');
      });
    } else {
      const apiUrl = `${url}/items/create`;
      axios.post(apiUrl, data.item).then((response) => {
          console.log("create response", response);
          window.location.replace('/admin');
      });
    }
  }
  const onRemove = (id) => {
    const apiUrl = `${url}/items/remove`;
    axios.post(apiUrl, {id:id}).then((response) => {
        console.log("remove response", response);
        window.location.replace('/admin');
    });
  }
  const onCancel = () => {
    window.location.replace('/admin');
  }
  return (
    <>
      {!item ? 
        <div></div> : 
        <ResponsiveModal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          animationDuration={1000}
          focusTrapped={true}
          closeIconSize={40}
          styles={styles}
          showCloseIcon={true}
        >
          <div className={'extra-info'}>Click ESC or click outside input.</div>
          <div className={'update-form-wrapper'}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <span>TITLE</span>
              <br/>
                <Controller
                    as={<input />}
                    name={`item.name`}
                    defaultValue={item.name}
                    control={control}
                />
                <br/>
              <span>DESCRIPTION</span>
              <br/>
                <Controller
                    as={<input />}
                    name={`item.description`}
                    defaultValue={item.description}
                    control={control}
                />
                <br/>
              <span>PRICE</span>
              <br/>
                <Controller
                    as={<input />}
                    name={`item.price`}
                    defaultValue={item.price}
                    control={control}
                    type={'number'}
                />
                <br/>
                <Controller
                    as={<input />}
                    name={`item.order`}
                    defaultValue={item.order}
                    control={control}
                    type={'number'}
                    className="data-only-element"
                />
                <br/>
              <span>TYPE</span>
              <br/>
                <Controller
                    as={
                        <select style={{ width: 200 }} className={"dropdown"}>
                            {types.map(d => {
                                return (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                                );
                            })}
                        </select>
                    }
                    placeholder="Type"
                    name="item.type"
                    defaultValue={item.type}
                    options={types}
                    onChange={([e]) => {
                        item.type = e;
                        return { value: e };
                    }}
                    control={control}
                />
                <br/>
                <Controller
                    as={<input />}
                    name={`active`}
                    defaultValue={1}
                    control={control}
                    type={'number'}
                    className="data-only-element"
                />
                <br/>
                <Controller
                    as={<input />}
                    name={`id`}
                    defaultValue={item.id ? item.id : ""}
                    control={control}
                    type={'number'}
                    className="data-only-element"
                />
                <br/>
                <button type='submit' className={"tst-button"}>{item.id ? 'update' : 'add'}</button>
                {item.id ? <div>
                  <button type='button' onClick={() => onRemove(item.id)} className={"tst-button"}>delete</button>
                </div> : <div></div>}
                <button type='button' onClick={() => onCancel()} className={"tst-button"}>cancel</button>
            </form>  
        </div>
        </ResponsiveModal>
      }
    </>
  );
};

export default SearchOverlay;