import type {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function dateReleaseTodayOrLater(): ValidatorFn {
  return (c:AbstractControl): ValidationErrors | null => {
    const v = c.value ? new Date(c.value as string) : null;
    if(!v) {return {required:true};}
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    v.setHours(0, 0, 0, 0);
    return v >= today ? null : {releaseInPast:true}
  }
}

export function dateRevisionOneYearAfter(releaseCtrlName ='date_release'): ValidatorFn {
  return (group:AbstractControl): ValidationErrors | null => {
    const release = group.get(releaseCtrlName)?.value as string;
    const revision = group.get('date_revision')?.value as string;
    if(!revision || !release) { return null}
    const r1 =  new Date(release);
    r1.setHours(0, 0, 0, 0);
    const r2 =  new Date(revision);
    r2.setHours(0, 0, 0, 0);
    const expected = new Date(r1);
    expected.setFullYear(expected.getFullYear() + 1);
    const ok = r2.getTime() === expected.getTime();
    return ok ? null : {revisionNotOneYear:true}
  }
}
