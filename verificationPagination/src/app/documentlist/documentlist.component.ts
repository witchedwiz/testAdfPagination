import { Component, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { AlfrescoApiService, NotificationService, NodesApiService, ObjectDataTableAdapter, ObjectDataRow } from '@alfresco/adf-core';
import { NodePaging } from 'alfresco-js-api';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { PreviewService } from '../services/preview.service';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html',
  styleUrls: ['./documentlist.component.css']
})
export class DocumentlistComponent implements OnInit {

  @Input()
  showViewer = false;
  nodeId: string = null;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  searchReady: boolean = false;
localNodePaging : NodePaging;

  constructor(private notificationService: NotificationService, private preview: PreviewService,
private apiService: AlfrescoApiService) {

  }

  uploadSuccess(event: any) {
    this.notificationService.openSnackMessage('File uploaded');
    this.documentList.reload();
  }

  showPreview(event) {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }

  onGoBack(event: any) {
    this.showViewer = false;
    this.nodeId = null;
  }

performRepresentation()
  {
    this.performOperation(25, 0, 'cm:modified', false).
    then(data => {
      this.localNodePaging = data;
    }, error => {
      console.error(error);
    });
  }

ngOnInit() {
    this.doStuff();
  }

performOperation(maxItemsProvided: number, skipCountProvided: number, fieldSort: string, ascendingSort: boolean): Promise<NodePaging> {
// tweak this path search as needed possibly going for a folder of more than 25 results.
        params.push('PATH:"/*"');
        return this.fetchInfos(params, skipCountProvided, maxItemsProvided, fieldSort, ascendingSort);
  }



fetchInfos(searchParams: string[], skipCountProvided: number, maxItemsProvided: number,
    fieldSort: string, ascendingSort: boolean): Promise<NodePaging> {
    let filterQueriesprov = null;
    if (searchParams !== null) {
      searchParams.forEach(element => {
        if (filterQueriesprov == null) {
          filterQueriesprov = [
            { query: element }
          ];
        }
        else {
          filterQueriesprov.push({ query: element });
        }
      });
    }

    const query = {
      query: {
        query: '*',
        language: 'afts'
      },
      filterQueries: filterQueriesprov,
      include: ['path', 'properties', 'allowableOperations'],
      sort: [{
        type: 'FIELD',
        field: fieldSort,
        ascending: ascendingSort
      }],
      paging: {
        maxItems: maxItemsProvided,
        skipCount: skipCountProvided
      }
    };
    return this.apiService.searchApi.search(query);
  }

}
