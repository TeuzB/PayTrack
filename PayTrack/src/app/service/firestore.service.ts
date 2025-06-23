// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  // CREATE
  addOrdem(ordem: any) {
    const ref = collection(this.firestore, 'ordens_servico');
    const id = doc(ref).id;
    const ordemDoc = doc(this.firestore, `ordens_servico/${id}`);
    return setDoc(ordemDoc, { ...ordem, id });
  }

  // READ - Todas
  getOrdens(): Observable<any[]> {
    const ref = collection(this.firestore, 'ordens_servico');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  // READ - Por ID
  getOrdemById(id: string): Promise<any> {
    const ordemDoc = doc(this.firestore, `ordens_servico/${id}`);
    return getDoc(ordemDoc);
  }

  // UPDATE
  updateOrdem(id: string, data: any) {
    const ordemDoc = doc(this.firestore, `ordens_servico/${id}`);
    return updateDoc(ordemDoc, data);
  }

  // DELETE
  deleteOrdem(id: string) {
    const ordemDoc = doc(this.firestore, `ordens_servico/${id}`);
    return deleteDoc(ordemDoc);
  }
}
