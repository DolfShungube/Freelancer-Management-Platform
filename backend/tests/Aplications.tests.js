
import supabase from '../config/superbaseClient.js'



jest.mock('../config/superbaseClient.js', () => ({
    from: jest.fn(() => ({

    select: jest.fn(() => ({

    eq: jest.fn(() => ({

    then: jest.fn((callback) =>Promise.resolve({ data: [{ id: 'freelancerid', name: 'big bear' }], error: null })),
     })),

    })),

    })),

   }));

describe('getFreelancer', () => {
    let service;

    beforeEach(() => {
        service = new Aplications('freelancerid','projectid');
        service.showAlert = jest.fn();

    });

    it('returns data on success', async () => {
        const freelancerData = [{ id: 'freelacerid', name: 'big bear' }];
        service.fetchFreelancer = jest.fn().mockResolvedValue({
            data: freelancerData,
            error: null
          });

        const result = await service.getFreelancer();

        expect(result).toEqual(freelancerData);
        expect(service.showAlert).not.toHaveBeenCalled();
    });

    it('alert on  an from Supabase error', async () => {
        service.fetchFreelancer = jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Something went wrong' }
        });
    
        const result = await service.getFreelancer();
    
        expect(result).toBeUndefined();
        expect(service.showAlert).toHaveBeenCalledWith('Something went wrong', 'error');
      });
    
      it('shows alert on exception', async () => {
        service.fetchFreelancer = jest.fn().mockRejectedValue(new Error('Unexpected error'));
    
        const result = await service.getFreelancer();
    
        expect(result).toBeUndefined();
        expect(service.showAlert).toHaveBeenCalledWith('Unexpected error', 'error');
      });
});


// testing   accepted aplication

describe('AcceptAplication', () => {
    let service;
    service = new Aplications('freelancerid', 'projectid');
    beforeEach(() => {
        jest.clearAllMocks();

      service.showAlert = jest.fn();
    });
  
    it(' accept an application and rejects others', async () => {

      const updateAcceptMock = {
        update: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
        })),
      };
  

      const updateRejectMock = {
        update: jest.fn(() => ({
          neq: jest.fn(() => ({
            match: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
          })),
        })),
      };
  

      const updateJobsMock = {
        update: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
        })),
      };
      supabase.from
      .mockReturnValueOnce(updateAcceptMock)
      .mockReturnValueOnce(updateRejectMock)
      .mockReturnValueOnce(updateJobsMock);
  
      await service.AcceptAplication();
      expect(service.showAlert).toHaveBeenCalledWith('success', 'success');
    });
  
  });


  describe('AcceptAplication with error', () => {
    let service;
    service = new Aplications('freelancerid', 'projectid');
    beforeEach(() => {
        jest.clearAllMocks();

      service.showAlert = jest.fn();
    });
  
    it('rejected due to an error', async () => {

      const updateAcceptMock = {
        update: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ data: [{}], error: { message: 'error' } })),
        })),
      };
  

      const updateRejectMock = {
        update: jest.fn(() => ({
          neq: jest.fn(() => ({
            match: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
          })),
        })),
      };
  

      const updateJobsMock = {
        update: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
        })),
      };
      supabase.from
      .mockReturnValueOnce(updateAcceptMock)
      .mockReturnValueOnce(updateRejectMock)
      .mockReturnValueOnce(updateJobsMock);
  
      await service.AcceptAplication();
      expect(service.showAlert).toHaveBeenCalledWith('error', 'error');
    });
  
  });


  describe(' reject aplication', () => {
    let service;
    service = new Aplications('freelancerid', 'projectid');
    service.projectID='jobid'
    beforeEach(() => {
        jest.clearAllMocks();
      service.showAlert = jest.fn();
    });
  
    it(' sucessfully rejected aplicant', async () => {

      const updateAcceptMock = {
        update: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ data: ['aplicants'], error:null})),
        })),
      };
  

      
      supabase.from.mockReturnValueOnce(updateAcceptMock)
      const d=await service.RejectAplication();
      expect(d).toEqual(['aplicants'])

    });


    it(' error in rejecting aplicant', async ()=> {

        const updateAcceptMock = {
          update: jest.fn(()=> ({
            match: jest.fn(()=> Promise.resolve({ data: ['aplicants'], error:{ message: 'error' } })),
          })),
        };
    
   //
        
        supabase.from.mockReturnValueOnce(updateAcceptMock)
        await service.RejectAplication();
        expect(service.showAlert).toHaveBeenCalledWith('error', 'error');
  
      });
  
  });


  describe(' reject aplication', () => {
    let service;
    service = new Aplications('freelancerid', 'projectid');
    service.projectID='jobid'
    beforeEach(() => {
        jest.clearAllMocks();
      service.showAlert = jest.fn();
    });
  
    it(' sucessfully rejected aplicant', async () => {

      const updateAcceptMock = {
        update: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ data: ['aplicants'], error:null})),
        })),
      };
  
 
      
      supabase.from.mockReturnValueOnce(updateAcceptMock)
      const d=await service.RejectAplication();
      expect(d).toEqual(['aplicants'])

    });


    it(' error in rejecting aplicant', async ()=> {

        const updateAcceptMock = {
          update: jest.fn(()=> ({
            match: jest.fn(()=> Promise.resolve({ data: ['aplicants'], error:{ message: 'error' } })),
          })),
        };
    
   //
        
        supabase.from.mockReturnValueOnce(updateAcceptMock)
        await service.RejectAplication();
        expect(service.showAlert).toHaveBeenCalledWith('error', 'error');
  
      });
  
  });


//   describe(' viewing freelancer cv', () => {
//     let service;
//     service = new Aplications('freelancerid', 'projectid');
//     service.projectID='jobid'
//     beforeEach(() => {
//         jest.clearAllMocks();
//       service.showAlert = jest.fn();
//     });
  
//     it('issue on cv fetch', async () => {

//       const updateAcceptMock = {
//         storage: jest.fn(()=>({
//         from: jest.fn(() => ({
//           download: jest.fn(() => Promise.resolve({ data:null, error:{message:'error'}})),
//         })),
//         })),

//       }

      
//       supabase.mockReturnValueOnce(updateAcceptMock)
//       await service.showCV('name');
//       expect(service.showAlert).toHaveBeenCalledWith('error', 'error');

//     });

//   });







