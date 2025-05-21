
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


import  {supabase } from '../config/superbaseClient';
import Utils, { Aplications } from '../Aplications/Utils.js';
import Swal from 'sweetalert2';
describe('getFreelancer', () => {
  let aplication;


  beforeEach(() => {
     aplication = new Aplications ('freelancerID','projectID');
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

  it('returns freelancer data on success', async () => {
    supabase.rpc.mockResolvedValue({
      data: [{ id:'freelancerID', name:'king' }],
      error: null
    });

    const result = await aplication.getFreelancer();
    expect(supabase.rpc).toHaveBeenCalledWith("getFreelancer", { fid: 'freelancerID' });
    expect(result).toEqual([{ id:'freelancerID', name:'king' }]);
   // expect(Swal.fire).not.toHaveBeenCalled();
    //expect(aplication.showAlert);
  });

  it('calls showAlert when Supabase returns an error', async () => {
    supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: 'Some supabase error' }
    });

    const result = await aplication.getFreelancer();
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

    const result = await aplication.getFreelancer();

    expect(result).toBeUndefined();
      expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'Unexpected exception',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });

  it('accepts aplication', async()=>{

      supabase.rpc.mockResolvedValue({
      data: [{  name:'added' }],
      error: null
    });

      const result = await aplication.AcceptAplication();
    expect(supabase.rpc).toHaveBeenCalledWith('assign_freelancer', {job_id: "projectID",selected_freelancer_id: "freelancerID"});
    expect(result).toEqual([{  name:'added' }]);



  })

    it('catches and alerts on thrown error', async () => {
    supabase.rpc.mockImplementation(() => {
      throw new Error('Unexpected exception');
    });

    const result = await aplication.AcceptAplication();

    expect(result).toBeUndefined();
      expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'Unexpected exception',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });


    it('calls showAlert when aplication accept not sussessful returns an error', async () => {
    supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: 'Some supabase error' }
    });

    const result = await aplication.AcceptAplication();
    console.log(result)

    expect(result).toBeUndefined();
        expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'Some supabase error',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });


it('reject freelancer', async()=>{

      supabase.rpc.mockResolvedValue({
      data: [{  name:'rejected' }],
      error: null
    });

      const result = await aplication.RejectAplication();
    expect(supabase.rpc).toHaveBeenCalledWith('reject_freelancer', {job_id: "projectID",selected_freelancer_id: "freelancerID"});
    expect(result).toEqual([{  name:'rejected' }]);



  })

    it('catches and alerts on thrown error', async () => {
    supabase.rpc.mockImplementation(() => {
      throw new Error('Unexpected exception');
    });

    const result = await aplication.RejectAplication();

    expect(result).toBeUndefined();
      expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'Unexpected exception',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });


    it('calls showAlert when aplication reject not sussessful returns an error', async () => {
    supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: 'Some supabase error' }
    });

    const result = await aplication.RejectAplication();
    console.log(result)

    expect(result).toBeUndefined();
        expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Oops!',
      text: 'Some supabase error',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });





});



