const cron = require('node-cron');

function a (){
    cron.schedule(`1 * * * * *`, async ()=>{        // 매분 01 초에 시행
        console.log('hi');
    });
}

a();
