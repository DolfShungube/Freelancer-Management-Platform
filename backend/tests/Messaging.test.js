
import supabase from '../config/superbaseClient.js';
import { Messages } from '../Messaging/Utils.js';




jest.mock('../config/superbaseClient.js', () => ({
    from: jest.fn(() => ({

    select: jest.fn(() => ({

    eq: jest.fn(() => ({

    then: jest.fn((callback) =>Promise.resolve({ data: [{ id: 'freelancerid', name: 'big bear' }], error: null })),
     })),

    })),

    })),

   }));

//    const theuser = {
//     auth: jest.fn(() => ({
//         getUser: jest.fn(()=> Promise.resolve({data: { user: { id: 'id' } } })),

//     })),
//   }

//   await supabase.mockReturnValueOnce(theuser)




  describe('Get all messeges', () => {
    let service;

    service = new Messages('clientid','freelancerid', 'projectid');

    beforeEach(() => {
        jest.clearAllMocks();
      service.showAlert = jest.fn();

    });
  
    it(' sucessfully got all messeges', async () => {

      const updateAcceptMock = {
        select: jest.fn(() => ({
          match: jest.fn(() => ({
            order: jest.fn(()=> Promise.resolve({data:['messeges']})),
            })),
        })),
      }
 
      
      supabase.from.mockReturnValueOnce(updateAcceptMock)
      const d=await service.getMassages();
      expect(d).toEqual(['messeges'])

    });


    it('error during message fetch', async ()=> {

        const updateAcceptMock = {
            select: jest.fn(() => ({
              match: jest.fn(() => ({
                order: jest.fn(()=> Promise.resolve({ data: ['aplicants'], error:{ message: 'error' }})),
                })),
            })),
          }
        
        supabase.from.mockReturnValueOnce(updateAcceptMock)
        await service.getMassages();
        expect(service.showAlert).toHaveBeenCalledWith('error', 'error');
  
      });
  
  });