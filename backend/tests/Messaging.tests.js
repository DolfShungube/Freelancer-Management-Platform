
import { describe, it, expect, vi, beforeEach } from 'vitest';

 vi.mock('../config/superbaseClient.js',()=> ({

    supabase: {
      rpc: vi.fn(),
    }
 }))





vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn()
  }
}));


import  {supabase } from '../config/superbaseClient.js';
import Utils, {  Messages } from '../Messaging/Utils.js';
import Swal from 'sweetalert2';
describe('getFreelancer', () => {
  let aplication;


  beforeEach(() => {
     aplication = new  Messages('clientID','freelancerID','projectID');
     Swal.fire.mockClear();
      supabase.rpc.mockReset();  
  });


  it('show alert on success',async ()=>{
    const result = await aplication.showAlert('success','success');
      expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Success!',
      text: 'success',
      icon: 'success',
      confirmButtonText: 'OK'
    });



  })

    it('show alert on error',async ()=>{
    const result = await aplication.showAlert('some error','error');
      expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'some error',
      icon: 'error',
      confirmButtonText: 'OK'
    });



  })

  it('returns messege data on success', async () => {
    supabase.rpc.mockResolvedValue({
      data: [{ id:'freelancerID', name:'king' }],
      error: null
    });

    const result = await aplication.getMassages();
    expect(supabase.rpc).toHaveBeenCalledWith('get_project_messages', {client_id: "clientID",freelancer_id:"freelancerID",project_id: "projectID"});
    expect(result).toEqual([{ id:'freelancerID', name:'king' }]);
   // expect(Swal.fire).not.toHaveBeenCalled();
    //expect(aplication.showAlert);
  });

  it('calls showAlert when Supabase returns an error', async () => {
    supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: 'Some supabase error' }
    });

    const result = await aplication.getMassages();
    console.log(result)

    expect(result).toBeUndefined();
        expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'Some supabase error',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });

  it('catches and alerts on thrown error', async () => {
    supabase.rpc.mockImplementation(() => {
      throw new Error('Unexpected exception');
    });

    const result = await aplication.getMassages();

    expect(result).toBeUndefined();
      expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'Unexpected exception',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });

 


  



});


