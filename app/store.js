import { useStore } from 'mobx-react';
import { makeAutoObservable } from "mobx";

class UserStore {
    usuario = "";
    fullName = "";
    constructor(parameters) {
        makeAutoObservable(this)
    }
    setUsuario(newUsuario) {
        this.usuario = newUsuario;
    }
    setFullName(newFullName) {
        this.fullName = newFullName;
    }
}
const userStore = new UserStore();
export default userStore;