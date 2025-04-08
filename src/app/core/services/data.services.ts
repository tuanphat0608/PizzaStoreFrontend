import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map, Observable, tap} from "rxjs";
import {TreeNode} from "../models/tree.model";
@Injectable()
export class DataService {
  constructor(private http: HttpClient) {

  }
  createCategory(name: string, parentId: string){
    return this.http.post('https://mpickstudio-abdc1-default-rtdb.firebaseio.com/category.json',{
      name: name,
      parent_id: parentId
    })

  }

  loadCategory(): Observable<any> {
    return this.http.get('https://mpickstudio-abdc1-default-rtdb.firebaseio.com/category.json')
      .pipe(map((cats: any) => {
        const postCategories = [];
        const postCategoriesFlat = [];
        for (let catsKey in cats) {
          const cat = cats[catsKey];
          if(!cat) continue;
          cat.id = catsKey;
          postCategoriesFlat.push(cat)
          if (!cat.parent_id) {
            postCategories.push({
              id: catsKey,
              label: cat.name,
              check: false,
              children: []
            })
          }
        }
        for (let catsKey in cats) {
          const cat = cats[catsKey];
          if(!cat) continue;
          if (cat.parent_id) {
            cat.id = catsKey;
            this.addChildCategory(postCategories, cat)
          }
        }
        return {
          flat:postCategoriesFlat,
          hierarchy:postCategories
        };
      }))
  }
  addChildCategory(cats: any[], cat: any){
    for (let i = 0; i < cats.length; i++) {
      if(cats[i].id === cat.parent_id){
        cats[i].children.push({
          id: cat.id,
          label: cat.name,
          check: false,
          children: []
        })
        return true;
      }
      if(this.addChildCategory(cats[i].children, cat)){
        return true;
      }
    }
    return false
  }
}
