import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { IOrder } from '../../shared/interface/i-order';

@Component({
  selector: 'app-allorder',
  standalone: true,
  imports: [],
  templateUrl: './allorder.component.html',
  styleUrls: ['./allorder.component.css']
})
export class AllorderComponent implements OnInit { // نفّذنا OnInit لتشغيل الكود عند التحميل

  // Injecting UserService للتعامل مع طلبات الأوامر (Orders)
  private readonly userService = inject(UserService);

  // userId لتخزين رقم تعريف المستخدم المسترجع من localStorage
  userId: string = '';

  // ispaid للإشارة إلى أن الطلبات مسددة (قابل للتوسعة لاحقًا لتصفية الطلبات)
  ispaid: boolean = true;

  // userOrders لتخزين قائمة الطلبات الخاصة بالمستخدم
  userOrders: IOrder[] = [];

  /**
   * ngOnInit ينفّذ تلقائيًا عند تحميل الكومبوننت
   * يستدعي دوال الحصول على ID المستخدم وجلب الطلبات
   */
  ngOnInit(): void {
    this.getUserId();
    this.getOrders();
  }

  /**
   * getUserId يسترجع userId من localStorage
   */
  getUserId(): void {
    this.userId = localStorage.getItem('userId')!; // نضع "!" لأنه من المفترض دائمًا يكون موجود، وإذا لم يكن موجود قد يسبب مشكلة
  }

  /**
   * getOrders يجلب الطلبات الخاصة بالمستخدم من خلال UserService
   */
  getOrders(): void {
    this.userService.getUserOrders(this.userId).subscribe({
      next: (res) => {
        console.log(res); // نطبع النتيجة للمتابعة في الـ Console
        this.userOrders = res; // نخزن النتائج في المصفوفة لعرضها في الواجهة
      },
      error: (err) => {
        console.log(err); // إذا حدث خطأ، نطبعه لمتابعته
      }
    });
  }
}
