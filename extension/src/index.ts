type RES = { studentCode: string; studentName: string; activePercent: number };

function capture(): void {
  document.head.innerHTML += `<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ' crossorigin='anonymous'>`;
  document.head.innerHTML += `
  <style>
    .baa-plus {
      display: none;
    }
    
    .baa:hover > .baa-plus {
      display: flex;
    }
  </style>
  `;
  document.head.innerHTML += `<link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' rel='stylesheet'/>`;
  const html: string = `
  <div style='background-color: #fff; z-index: 9999;' class='baa border fixed-top'>
    <div style='background-color: aliceblue'>
      <b>COLLAPSE</b>
    </div>
    <div class='baa-plus px-3 pt-1'>
      <div class='w-50'>
        <div class='mt-2 mb-3'>
          <button class='btn btn-primary' style='width: 200px' id='generate-code-button'>GENERATE CODE</button>
          <button class='btn btn-primary' style='width: 400px' id='capture-button'>JOIN AND START CAPTURE</button>
          <button class='btn btn-primary' style='width: 200px' id='see-statistics-button'>SEE STATISTICS</button>
        </div>
        <div class=' pt-2'>
          <div class='input-group mb-3'>
            <span class='input-group-text' id='inputGroup-sizing-sm'>Id:</span>
            <input type='text' id='id-input' class='form-control' aria-label='Sizing example input' aria-describedby='inputGroup-sizing-default'>
          </div>
          <div class='input-group mb-3'>
            <span class='input-group-text' id='inputGroup-sizing-sm'>Generated code:</span>
            <input type='text' id='generate-code-input' class='form-control' aria-label='Sizing example input' aria-describedby='inputGroup-sizing-default'>
          </div>
        </div>
        <div class=''>  
          <div class='input-group mb-3'>
            <span class='input-group-text' id='inputGroup-sizing-sm'>START:</span>
            <input type='datetime-local' id='start-time-input' value='DINH_CONG_DOAN' class='form-control' aria-label='Sizing example input' aria-describedby='inputGroup-sizing-default'>
          </div>
          <div class='input-group mb-3'>
            <span class='input-group-text' id='inputGroup-sizing-sm'>END:</span>
            <input type='datetime-local' id='end-time-input' class='form-control' aria-label='Sizing example input' aria-describedby='inputGroup-sizing-default'>
          </div>
        </div>
      </div>
      <div class='px-5 w-50' style='height: 250px; overflow-y: auto' id='renderer'></div>
    </div>
  </div>
  `;

  // @ts-ignore
  let div: HTMLDivElement = document.getElementById('hackathon');
  if (div) {
    div.innerHTML = html;
  } else {
    div = document.createElement('div');
    div.id = 'hackathon';
    div.innerHTML = html;
  }
  document.body.insertBefore(div, document.body.firstChild);

  let statistics: RES[] = [{
    studentCode: '19110498',
    studentName: 'Do Quoc Viet',
    activePercent: 80
  }, {
    studentCode: '19110489',
    studentName: 'Luong Quoc Trung',
    activePercent: 30
  }, {
    studentCode: '19110121',
    studentName: 'Le Tuan Nghia',
    activePercent: 60
  }, {
    studentCode: '19191918',
    studentName: 'Nguyen Duc Sang',
    activePercent: 10
  }, {
    studentCode: '19110489',
    studentName: 'Luong Quoc Trung',
    activePercent: 30
  }, {
    studentCode: '19110121',
    studentName: 'Le Tuan Nghia',
    activePercent: 60
  }, {
    studentCode: '19191918',
    studentName: 'Nguyen Duc Sang',
    activePercent: 10
  }, {
    studentCode: '19110489',
    studentName: 'Luong Quoc Trung',
    activePercent: 30
  }, {
    studentCode: '19110121',
    studentName: 'Le Tuan Nghia',
    activePercent: 60
  }, {
    studentCode: '19191918',
    studentName: 'Nguyen Duc Sang',
    activePercent: 10
  }];

  // @ts-ignore
  const generateCodeButton: HTMLButtonElement = document.getElementById('generate-code-button')!;
  // @ts-ignore
  const generateCodeInput: HTMLInputElement = document.getElementById('generate-code-input')!;
  // @ts-ignore
  const idInput: HTMLInputElement = document.getElementById('id-input')!;
  // @ts-ignore
  const startTimeInput: HTMLButtonElement = document.getElementById('start-time-input')!;
  // @ts-ignore
  const endTimeInput: HTMLInputElement = document.getElementById('end-time-input')!;
  // @ts-ignore
  const captureButton: HTMLInputElement = document.getElementById('capture-button')!;
  // @ts-ignore
  const rendererDiv: HTMLDivElement = document.getElementById('renderer')!;
  // @ts-ignore
  const seeStatisticsButton: HTMLButtonElement = document.getElementById('see-statistics-button')!;

  seeStatisticsButton.disabled = true;

  let interval: any;
  let isCapturing: boolean = false;
  captureButton.addEventListener('click', (): void => {
    if (isCapturing && interval) {
      clearInterval(interval);
      captureButton.innerText = 'JOIN AND START CAPTURE';
      generateCodeButton.disabled = false;
      idInput.readOnly = false;
      startTimeInput.disabled = false;
      endTimeInput.disabled = false;
      isCapturing = false;
      generateCodeInput.readOnly = true;
    } else {
      listener();
      isCapturing = true;
      captureButton.innerText = 'STOP CAPTURE';
      generateCodeButton.disabled = true;
      generateCodeInput.readOnly = true;
      idInput.readOnly = true;
      startTimeInput.disabled = true;
      endTimeInput.disabled = true;
      captureButton.disabled = false;
    }
  });

  seeStatisticsButton.addEventListener('click', (): void => {
    // generate statistics
    const responsePromise: Promise<any> = new Promise((resolve, reject): void => {
      resolve(fetch(`http://localhost:8000/join-meeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'applicaiton/json' }
      }));
    });
    responsePromise.then((response: Response): void => {
      // Handle response
      response.json().then((result: any): void => {
        statistics = [];
        statistics.push(...result.students.map((item: any): RES => {
          return {
            studentCode: item.studentId,
            studentName: item.name,
            activePercent: Math.round((result.total ? item.perAction / result.total : 0) * 100)
          };
        }));
        rendererDiv.innerHTML = `
          <table class='table mx-auto w-100'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Student Code</th>
                <th scope='col'>Student Name</th>
                <th scope='col'>Active percent</th>
              </tr>
            </thead>
            <tbody>
              ${statistics
          .map((statistic, index: number) => `
                  <tr>
                    <th scope='row'>${index + 1}</th>
                    <td>${statistic.studentCode}</td>
                    <td>${statistic.studentName}</td>
                    <td class='text-center'>${statistic.activePercent} ${statistic.activePercent > 70 ? `<i style='color: green; font-size: 20px' class='fa-sharp fa-solid fa-circle-check'></i>` : statistic.activePercent > 50 ? `<i style='color: yellow; font-size: 20px' class='fa-solid fa-triangle-exclamation fa-shake'></i>` : `<i style='color: red; font-size: 20px' class='fa-sharp fa-solid fa-circle-xmark fa-beat-fade'></i>`}</td>
                  </tr>`)
          .join('')}
            </tbody>
          </table>`;
      });
    });
  });

  generateCodeButton.addEventListener('click', (): void => {
    const responsePromise: Promise<any> = new Promise((resolve, reject): void => {
      resolve(fetch(`http://localhost:8000/join-meeting?teacherId=${idInput.value}`, {
        method: 'GET',
        headers: { 'Content-Type': 'image/jpeg' }
      }));
    });
    responsePromise.then((response: Response): void => {
      // Handle response
      response.json().then((result: any): void => {
        if (!result) {
          alert('Please input invalid teacher Id');
          return;
        }
        generateCodeInput.value = result;
        generateCodeInput.readOnly = true;
        captureButton.disabled = true;
        seeStatisticsButton.disabled = false;
      });
    });
  });

  const listener = (): void => {
    captureButton.disabled = true;
    if (!idInput.value) {
      alert('Please input a valid id');
    }
    if (!generateCodeInput.value) {
      alert('Please enter a valid code');
    }
    const responsePromise: Promise<any> = new Promise((resolve, reject): void => {
      resolve(fetch(`http://localhost:8000/join-meeting?generateCode=${generateCodeInput.value}&studentId=${idInput.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      }));
    });
    responsePromise.then((response: Response): void => {
      // Handle response
      // Set timeout then perform action record
      // set Time
      response.json().then((result: boolean): void => {
        if (!result) {
          return;
        }
        interval = setInterval((): void => {
          window.navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((mediaStream: MediaStream): void => {
              const mediaStreamTrack: MediaStreamTrack = mediaStream.getVideoTracks()[0];
              // @ts-ignore
              const imageCapture = new ImageCapture(mediaStreamTrack);
              imageCapture.takePhoto({ imageHeight: 300, imageWidth: 220 })
                // @ts-ignore
                .then((blog: Blob): void => {
                  blog.arrayBuffer().then((arrayBuffer: ArrayBuffer): void => {
                    const image: string = btoa(new Uint8Array(arrayBuffer)
                      .reduce((data: string, byte: number) => data + String.fromCharCode(byte), ''));
                    const responsePromise: Promise<any> = new Promise((resolve, reject): void => {
                      resolve(fetch('http://localhost:8000/photo', {
                        method: 'POST',
                        body: `data:image/jpeg;base64,${image}`,
                        headers: { 'Content-Type': 'image/jpeg' }
                      }));
                    });
                    responsePromise.then((response: Response): void => {
                      console.log(response);
                    });
                  });
                })
                // @ts-ignore
                .catch((error): void => {
                  console.log(error);
                });
            });
        }, 2000);
        captureButton.disabled = false;
      });
    });
  };
}

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab): void => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: capture,
    args: []
  }).then();
});
