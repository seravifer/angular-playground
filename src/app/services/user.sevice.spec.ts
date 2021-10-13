import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';


describe('UserService', () => {

  it('should return a promise', (done) => {
    const service = new UserService();
    service.requestPromise().then(res => {
      expect(res).not.toBeNull();
      done();
    });
  });

  it('should return a observable', (done) => {
    const service = new UserService();
    service.requestObservable().subscribe(res => {
      expect(res).not.toBeNull();
      done();
    });
  });

  it('should return a value', () => {
    const service = new UserService();
    expect(service.requestValue()).not.toBeNull();
  });

});
