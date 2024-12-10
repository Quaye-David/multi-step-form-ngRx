import { TestBed } from '@angular/core/testing';
import { FormDataService } from './form-data.service';
import { FormData, PlanType } from '../models/form-data.interface';

describe('FormDataService', () => {
  let service: FormDataService;

  const mockFormData: FormData = {
    personalInfo: { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
    plan: { type: 'pro', isYearly: true, price: 100 },
    addons: [
      {
        id: "1",
        name: "Addon1",
        price: 20,
        selected: true
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockFormData));
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    service = TestBed.inject(FormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load form data from localStorage on initialization', () => {
    expect(localStorage.getItem).toHaveBeenCalledWith('formData');
    service.formData$.subscribe(data => {
      expect(data).toEqual(mockFormData);
    });
    service.isFormValid$.subscribe(valid => {
      expect(valid).toBeTrue();
    });
  });

  it('should update personal info and save to localStorage', () => {
    const newPersonalInfo = { name: 'Jane Doe', email: 'jane@example.com', phone: '+0987654321' };
    service.updatePersonalInfo(newPersonalInfo);
    service.formData$.subscribe(data => {
      expect(data.personalInfo).toEqual(newPersonalInfo);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('formData', JSON.stringify({
      ...mockFormData,
      personalInfo: newPersonalInfo
    }));
  });

  it('should update plan and save to localStorage', () => {
    const newPlan: FormData['plan'] = { type: 'basic', isYearly: false, price: 50 };
    service.updatePlan(newPlan);
    service.formData$.subscribe(data => {
      expect(data.plan).toEqual(newPlan);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('formData', JSON.stringify({
      ...mockFormData,
      plan: newPlan
    }));
  });
  
  it('should update addons and save to localStorage', () => {
    const newAddons: FormData['addons'] = [
      {
        id: "3",
        name: "Addon3",
        price: 30,
        selected: true
      }
    ];
    service.updateAddons(newAddons);
    service.formData$.subscribe(data => {
      expect(data.addons).toEqual(newAddons);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('formData', JSON.stringify({
      ...mockFormData,
      addons: newAddons
    }));
  });

  it('should clear storage and reset form data', () => {
    spyOn(localStorage, 'removeItem').and.callFake(() => {});
    service.clearStorage();
    service.formData$.subscribe(data => {
      expect(data).toEqual({
        personalInfo: { name: '', email: '', phone: '' },
        plan: { type: '', isYearly: false, price: 0 },
        addons: []
      });
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('formData');
  });

  it('should validate form correctly', () => {
    // Valid data
    service.formData$.subscribe();
    expect(service.isFormValid$).toBeTruthy();

    // Invalid personal info
    service.updatePersonalInfo({ name: 'J', email: 'invalid', phone: '123' });
    service.isFormValid$.subscribe(valid => {
      expect(valid).toBeFalse();
    });
  });
});