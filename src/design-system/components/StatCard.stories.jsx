/**
 * StatCard Component Examples
 * 
 * This file demonstrates all variants and use cases of the StatCard component.
 * Use these examples as a reference when implementing stat cards across the application.
 */

import React from 'react';
import StatCard from './StatCard';
import {
  IndianRupee,
  Users,
  Calendar,
  Heart,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

// Example 1: Solid Variant (Dashboard Style)
export const SolidVariantExamples = () => (
  <div className="p-8 bg-gray-100">
    <h2 className="text-2xl font-bold mb-6">Solid Variant (Dashboard Style)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        variant="solid"
        colorScheme="emerald"
        label="Total Revenue"
        value="₹2,45,000"
        sublabel="This month"
        icon={IndianRupee}
        trend={{ value: 12.5 }}
        showAnimatedDot={true}
      />
      
      <StatCard
        variant="solid"
        colorScheme="blue"
        label="Total Patients"
        value="1,234"
        sublabel="56 new this month"
        icon={Users}
        trend={{ value: 8.2 }}
        showAnimatedDot={true}
      />
      
      <StatCard
        variant="solid"
        colorScheme="purple"
        label="Appointments"
        value="89"
        sublabel="Today's schedule"
        icon={Calendar}
        trend={{ value: 95, label: "95%" }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="rose"
        label="Services"
        value="156"
        sublabel="Completed today"
        icon={Heart}
        trend={{ value: 89, label: "89%" }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="amber"
        label="Low Stock"
        value="12"
        sublabel="Need attention"
        icon={AlertTriangle}
        trend={{ value: -5, label: "Alert" }}
        showAnimatedDot={true}
      />
      
      <StatCard
        variant="solid"
        colorScheme="cyan"
        label="Pending Orders"
        value="24"
        sublabel="Active orders"
        icon={ShoppingBag}
        trend={{ value: 0, label: "Active" }}
        showAnimatedDot={true}
      />
    </div>
  </div>
);

// Example 2: Subtle Variant (Products Style)
export const SubtleVariantExamples = () => (
  <div className="p-8 bg-gray-100">
    <h2 className="text-2xl font-bold mb-6">Subtle Variant (Products Style)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        variant="subtle"
        colorScheme="gray"
        label="Total Products"
        value="1,245"
        sublabel="All items"
        icon={Package}
      />
      
      <StatCard
        variant="subtle"
        colorScheme="emerald"
        label="Active Products"
        value="1,180"
        sublabel="Available now"
        icon={CheckCircle}
        showAnimatedDot={true}
      />
      
      <StatCard
        variant="subtle"
        colorScheme="amber"
        label="Low Stock"
        value="45"
        sublabel="Need attention"
        icon={AlertTriangle}
        showAnimatedDot={true}
      />
      
      <StatCard
        variant="subtle"
        colorScheme="red"
        label="Out of Stock"
        value="20"
        sublabel="Not available"
        icon={XCircle}
      />
      
      <StatCard
        variant="subtle"
        colorScheme="blue"
        label="Total Value"
        value="₹1.2Cr"
        sublabel="Inventory value"
        icon={IndianRupee}
      />
      
      <StatCard
        variant="subtle"
        colorScheme="gray"
        label="Inactive"
        value="65"
        sublabel="Hidden items"
        icon={XCircle}
      />
    </div>
  </div>
);

// Example 3: Glass Variant (Orders Style)
export const GlassVariantExamples = () => (
  <div className="p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
    <h2 className="text-2xl font-bold mb-6">Glass Variant (Orders Style)</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        variant="glass"
        colorScheme="gray"
        label="Total Orders"
        value="456"
        sublabel="All orders"
        icon={ShoppingBag}
      />
      
      <StatCard
        variant="glass"
        colorScheme="blue"
        label="Confirmed"
        value="123"
        sublabel="Confirmed"
        icon={CheckCircle}
      />
      
      <StatCard
        variant="glass"
        colorScheme="purple"
        label="Processing"
        value="45"
        sublabel="In progress"
        icon={Clock}
      />
      
      <StatCard
        variant="glass"
        colorScheme="cyan"
        label="Shipped"
        value="234"
        sublabel="On the way"
        icon={Package}
      />
      
      <StatCard
        variant="glass"
        colorScheme="emerald"
        label="Delivered"
        value="189"
        sublabel="Completed"
        icon={CheckCircle}
      />
      
      <StatCard
        variant="glass"
        colorScheme="red"
        label="Cancelled"
        value="12"
        sublabel="Cancelled"
        icon={XCircle}
      />
      
      <StatCard
        variant="glass"
        colorScheme="amber"
        label="Returned"
        value="8"
        sublabel="Returned"
        icon={AlertTriangle}
      />
    </div>
  </div>
);

// Example 4: Simple Variant (Bookings/Patients Style)
export const SimpleVariantExamples = () => (
  <div className="p-8 bg-white">
    <h2 className="text-2xl font-bold mb-6">Simple Variant (Bookings/Patients Style)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        variant="simple"
        colorScheme="blue"
        label="Total Bookings"
        value="234"
        sublabel="All bookings"
        icon={Calendar}
      />
      
      <StatCard
        variant="simple"
        colorScheme="green"
        label="Confirmed"
        value="189"
        sublabel="Confirmed"
        icon={CheckCircle}
      />
      
      <StatCard
        variant="simple"
        colorScheme="amber"
        label="Pending"
        value="32"
        sublabel="Awaiting"
        icon={Clock}
      />
      
      <StatCard
        variant="simple"
        colorScheme="red"
        label="Cancelled"
        value="13"
        sublabel="Cancelled"
        icon={XCircle}
      />
    </div>
  </div>
);

// Example 5: All Color Schemes
export const AllColorSchemes = () => (
  <div className="p-8 bg-gray-100">
    <h2 className="text-2xl font-bold mb-6">All Color Schemes (Solid Variant)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        variant="solid"
        colorScheme="emerald"
        label="Emerald"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="blue"
        label="Blue"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="purple"
        label="Purple"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="amber"
        label="Amber"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="red"
        label="Red"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="gray"
        label="Gray"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="cyan"
        label="Cyan"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="rose"
        label="Rose"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
      
      <StatCard
        variant="solid"
        colorScheme="green"
        label="Green"
        value="1,234"
        icon={TrendingUp}
        trend={{ value: 12 }}
      />
    </div>
  </div>
);

// Example 6: Interactive Cards
export const InteractiveCards = () => {
  const handleClick = (label) => {
    alert(`Clicked: ${label}`);
  };

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Interactive Cards (Clickable)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          variant="solid"
          colorScheme="emerald"
          label="Revenue"
          value="₹2,45,000"
          sublabel="Click to view details"
          icon={IndianRupee}
          trend={{ value: 12.5 }}
          onClick={() => handleClick('Revenue')}
        />
        
        <StatCard
          variant="subtle"
          colorScheme="blue"
          label="Patients"
          value="1,234"
          sublabel="Click to view list"
          icon={Users}
          onClick={() => handleClick('Patients')}
        />
        
        <StatCard
          variant="glass"
          colorScheme="purple"
          label="Appointments"
          value="89"
          sublabel="Click to manage"
          icon={Calendar}
          onClick={() => handleClick('Appointments')}
        />
      </div>
    </div>
  );
};

// Example 7: Without Optional Props
export const MinimalCards = () => (
  <div className="p-8 bg-gray-100">
    <h2 className="text-2xl font-bold mb-6">Minimal Cards (Required Props Only)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        label="Simple Card"
        value="1,234"
      />
      
      <StatCard
        variant="subtle"
        colorScheme="blue"
        label="With Color"
        value="5,678"
      />
      
      <StatCard
        variant="glass"
        label="Glass Style"
        value="9,012"
      />
    </div>
  </div>
);

// Main Demo Component
const StatCardDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">StatCard Component Examples</h1>
          <p className="text-lg text-gray-600">
            Comprehensive examples of all StatCard variants and configurations
          </p>
        </div>

        <div className="space-y-12">
          <SolidVariantExamples />
          <SubtleVariantExamples />
          <GlassVariantExamples />
          <SimpleVariantExamples />
          <AllColorSchemes />
          <InteractiveCards />
          <MinimalCards />
        </div>
      </div>
    </div>
  );
};

export default StatCardDemo;
