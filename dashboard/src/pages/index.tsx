/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Dropdown, Table, useTheme } from "flowbite-react";
import type { FC } from "react";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import svgMap from "svgmap";
import "svgmap/dist/svgMap.min.css";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <SalesThisWeek />
        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NewProductsThisWeek />
          <VisitorsThisWeek />
          <UserSignupsThisWeek />
        </div>
        <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-3">
          <SessionsByCountry />
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
            <LatestCustomers />
            <AcquisitionOverview />
          </div>
        </div>
        <Transactions />
      </div>
    </NavbarSidebarLayout>
  );
};

const SalesThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            $45,385
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            Sales this week
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          12.5%
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <SalesChart />
      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Sales Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const SalesChart: FC = function () {
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
  const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
  const opacityFrom = isDarkTheme ? 0 : 0.45;
  const opacityTo = isDarkTheme ? 0.15 : 0;

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom,
        opacityTo,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: [
        "01 Feb",
        "02 Feb",
        "03 Feb",
        "04 Feb",
        "05 Feb",
        "06 Feb",
        "07 Feb",
      ],
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return "$" + value;
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Revenue",
      data: [6356, 6218, 6156, 6526, 6356, 6256, 6056],
      color: "#1A56DB",
    },
    {
      name: "Revenue (previous period)",
      data: [6556, 6725, 6424, 6356, 6586, 6756, 6616],
      color: "#FDBA8C",
    },
  ];

  return <Chart height={420} options={options} series={series} type="area" />;
};

const Datepicker: FC = function () {
  return (
    <span className="text-sm text-gray-600">
      <Dropdown inline label="Last 7 days">
        <Dropdown.Item>
          <strong>Sep 16, 2021 - Sep 22, 2021</strong>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Yesterday</Dropdown.Item>
        <Dropdown.Item>Today</Dropdown.Item>
        <Dropdown.Item>Last 7 days</Dropdown.Item>
        <Dropdown.Item>Last 30 days</Dropdown.Item>
        <Dropdown.Item>Last 90 days</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Custom...</Dropdown.Item>
      </Dropdown>
    </span>
  );
};

const NewProductsThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            2,340
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            New products this week
          </h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          14.6%
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <NewProductsChart />
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Products Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const NewProductsChart: FC = function () {
  const options: ApexCharts.ApexOptions = {
    colors: ["#1A56DB", "#FDBA8C"],
    chart: {
      fontFamily: "Inter, sans-serif",
      foreColor: "#4B5563",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 3,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: true,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  };
  const series = [
    {
      name: "Digital",
      color: "#1A56DB",
      data: [
        { x: "01 Feb", y: 170 },
        { x: "02 Feb", y: 180 },
        { x: "03 Feb", y: 164 },
        { x: "04 Feb", y: 145 },
        { x: "05 Feb", y: 174 },
        { x: "06 Feb", y: 170 },
        { x: "07 Feb", y: 155 },
      ],
    },
    {
      name: "Goods",
      color: "#FDBA8C",
      data: [
        { x: "01 Feb", y: 120 },
        { x: "02 Feb", y: 134 },
        { x: "03 Feb", y: 167 },
        { x: "04 Feb", y: 179 },
        { x: "05 Feb", y: 145 },
        { x: "06 Feb", y: 182 },
        { x: "07 Feb", y: 143 },
      ],
    },
  ];

  return <Chart height={305} options={options} series={series} type="bar" />;
};

const VisitorsThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            5,355
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            Visitors this week
          </h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          32.9%
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <VisitorsChart />
      <div className="mt-3.5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Visits Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const VisitorsChart: FC = function () {
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const fillGradientShade = isDarkTheme ? "dark" : "light";
  const fillGradientShadeIntensity = isDarkTheme ? 0.45 : 1;

  const options: ApexCharts.ApexOptions = {
    labels: [
      "01 Feb",
      "02 Feb",
      "03 Feb",
      "04 Feb",
      "05 Feb",
      "06 Feb",
      "07 Feb",
    ],
    chart: {
      fontFamily: "Inter, sans-serif",
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: fillGradientShade,
        shadeIntensity: fillGradientShadeIntensity,
      },
    },
    plotOptions: {
      area: {
        fillTo: "end",
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#1A56DB",
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
  };
  const series = [
    {
      name: "Visitors",
      data: [500, 590, 600, 520, 610, 550, 600],
    },
  ];

  return <Chart height={305} options={options} series={series} type="area" />;
};

const UserSignupsThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            385
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            User signups this week
          </h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-red-600 dark:text-red-400">
          -2.7%
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <UserSignupsChart />
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Users Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const UserSignupsChart: FC = function () {
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const backgroundBarColors = isDarkTheme
    ? [
        "#374151",
        "#374151",
        "#374151",
        "#374151",
        "#374151",
        "#374151",
        "#374151",
      ]
    : [
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
        "#E5E7EB",
      ];

  const options: ApexCharts.ApexOptions = {
    labels: [
      "01 Feb",
      "02 Feb",
      "03 Feb",
      "04 Feb",
      "05 Feb",
      "06 Feb",
      "07 Feb",
    ],
    chart: {
      foreColor: "#4B5563",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#1A56DB",
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "25%",
        borderRadius: 3,
        colors: {
          backgroundBarColors,
          backgroundBarRadius: 3,
        },
      },
    },
    xaxis: {
      floating: true,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.8,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };
  const series = [
    {
      name: "Users",
      data: [34, 45, 53, 38, 55, 32, 36],
    },
  ];

  return <Chart height={305} options={options} series={series} type="bar" />;
};

const SessionsByCountry: FC = function () {
  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:mb-0 xl:p-8 2xl:col-span-2">
      <div className="mb-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          Sessions by country
        </h3>
        <span className="text-base font-normal text-gray-600 dark:text-gray-400">
          View website visitors by hovering over the map
        </span>
      </div>
      <SessionsByCountryMap />
      <ul className="space-y-6">
        <li className="w-full items-center sm:flex">
          <div className="mb-3 flex items-center sm:mb-0">
            <svg
              className="h-4 w-4"
              viewBox="0 0 26 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="0.529053"
                width="25.7522"
                height="17.1429"
                rx={2}
                fill="white"
              />
              <mask
                id="mask0"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={26}
                height={18}
              >
                <rect
                  y="0.529053"
                  width="25.7522"
                  height="17.1429"
                  rx={2}
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M25.7522 0.529053H0V1.67191H25.7522V0.529053ZM25.7522 2.81477H0V3.95763H25.7522V2.81477ZM0 5.10048H25.7522V6.24333H0V5.10048ZM25.7522 7.3862H0V8.52905H25.7522V7.3862ZM0 9.67192H25.7522V10.8148H0V9.67192ZM25.7522 11.9576H0V13.1005H25.7522V11.9576ZM0 14.2433H25.7522V15.3862H0V14.2433ZM25.7522 16.5291H0V17.6719H25.7522V16.5291Z"
                  fill="#D02F44"
                />
                <rect y="0.529053" width="11.0367" height={8} fill="#46467F" />
                <g filter="url(#filter0_d)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.45237 2.2433C2.45237 2.5589 2.17786 2.81473 1.83922 2.81473C1.50059 2.81473 1.22607 2.5589 1.22607 2.2433C1.22607 1.92771 1.50059 1.67188 1.83922 1.67188C2.17786 1.67188 2.45237 1.92771 2.45237 2.2433ZM4.90496 2.2433C4.90496 2.5589 4.63045 2.81473 4.29182 2.81473C3.95318 2.81473 3.67867 2.5589 3.67867 2.2433C3.67867 1.92771 3.95318 1.67188 4.29182 1.67188C4.63045 1.67188 4.90496 1.92771 4.90496 2.2433ZM6.74441 2.81473C7.08304 2.81473 7.35756 2.5589 7.35756 2.2433C7.35756 1.92771 7.08304 1.67188 6.74441 1.67188C6.40578 1.67188 6.13126 1.92771 6.13126 2.2433C6.13126 2.5589 6.40578 2.81473 6.74441 2.81473ZM9.81015 2.2433C9.81015 2.5589 9.53564 2.81473 9.197 2.81473C8.85837 2.81473 8.58386 2.5589 8.58386 2.2433C8.58386 1.92771 8.85837 1.67188 9.197 1.67188C9.53564 1.67188 9.81015 1.92771 9.81015 2.2433ZM3.06552 3.95758C3.40415 3.95758 3.67867 3.70175 3.67867 3.38616C3.67867 3.07056 3.40415 2.81473 3.06552 2.81473C2.72689 2.81473 2.45237 3.07056 2.45237 3.38616C2.45237 3.70175 2.72689 3.95758 3.06552 3.95758ZM6.13126 3.38616C6.13126 3.70175 5.85675 3.95758 5.51811 3.95758C5.17948 3.95758 4.90496 3.70175 4.90496 3.38616C4.90496 3.07056 5.17948 2.81473 5.51811 2.81473C5.85675 2.81473 6.13126 3.07056 6.13126 3.38616ZM7.97071 3.95758C8.30934 3.95758 8.58386 3.70175 8.58386 3.38616C8.58386 3.07056 8.30934 2.81473 7.97071 2.81473C7.63207 2.81473 7.35756 3.07056 7.35756 3.38616C7.35756 3.70175 7.63207 3.95758 7.97071 3.95758ZM9.81015 4.52902C9.81015 4.84462 9.53564 5.10045 9.197 5.10045C8.85837 5.10045 8.58386 4.84462 8.58386 4.52902C8.58386 4.21343 8.85837 3.9576 9.197 3.9576C9.53564 3.9576 9.81015 4.21343 9.81015 4.52902ZM6.74441 5.10045C7.08304 5.10045 7.35756 4.84462 7.35756 4.52902C7.35756 4.21343 7.08304 3.9576 6.74441 3.9576C6.40578 3.9576 6.13126 4.21343 6.13126 4.52902C6.13126 4.84462 6.40578 5.10045 6.74441 5.10045ZM4.90496 4.52902C4.90496 4.84462 4.63045 5.10045 4.29182 5.10045C3.95318 5.10045 3.67867 4.84462 3.67867 4.52902C3.67867 4.21343 3.95318 3.9576 4.29182 3.9576C4.63045 3.9576 4.90496 4.21343 4.90496 4.52902ZM1.83922 5.10045C2.17786 5.10045 2.45237 4.84462 2.45237 4.52902C2.45237 4.21343 2.17786 3.9576 1.83922 3.9576C1.50059 3.9576 1.22607 4.21343 1.22607 4.52902C1.22607 4.84462 1.50059 5.10045 1.83922 5.10045ZM3.67867 5.67188C3.67867 5.98747 3.40415 6.2433 3.06552 6.2433C2.72689 6.2433 2.45237 5.98747 2.45237 5.67188C2.45237 5.35628 2.72689 5.10045 3.06552 5.10045C3.40415 5.10045 3.67867 5.35628 3.67867 5.67188ZM5.51811 6.2433C5.85675 6.2433 6.13126 5.98747 6.13126 5.67188C6.13126 5.35628 5.85675 5.10045 5.51811 5.10045C5.17948 5.10045 4.90496 5.35628 4.90496 5.67188C4.90496 5.98747 5.17948 6.2433 5.51811 6.2433ZM8.58386 5.67188C8.58386 5.98747 8.30934 6.2433 7.97071 6.2433C7.63207 6.2433 7.35756 5.98747 7.35756 5.67188C7.35756 5.35628 7.63207 5.10045 7.97071 5.10045C8.30934 5.10045 8.58386 5.35628 8.58386 5.67188ZM9.197 7.38616C9.53564 7.38616 9.81015 7.13032 9.81015 6.81473C9.81015 6.49914 9.53564 6.2433 9.197 6.2433C8.85837 6.2433 8.58386 6.49914 8.58386 6.81473C8.58386 7.13032 8.85837 7.38616 9.197 7.38616ZM7.35756 6.81473C7.35756 7.13032 7.08304 7.38616 6.74441 7.38616C6.40578 7.38616 6.13126 7.13032 6.13126 6.81473C6.13126 6.49914 6.40578 6.2433 6.74441 6.2433C7.08304 6.2433 7.35756 6.49914 7.35756 6.81473ZM4.29182 7.38616C4.63045 7.38616 4.90496 7.13032 4.90496 6.81473C4.90496 6.49914 4.63045 6.2433 4.29182 6.2433C3.95318 6.2433 3.67867 6.49914 3.67867 6.81473C3.67867 7.13032 3.95318 7.38616 4.29182 7.38616ZM2.45237 6.81473C2.45237 7.13032 2.17786 7.38616 1.83922 7.38616C1.50059 7.38616 1.22607 7.13032 1.22607 6.81473C1.22607 6.49914 1.50059 6.2433 1.83922 6.2433C2.17786 6.2433 2.45237 6.49914 2.45237 6.81473Z"
                    fill="url(#paint0_linear)"
                  />
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="1.22607"
                  y="1.67188"
                  width="8.58408"
                  height="6.71428"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy={1} />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear"
                  x1="1.22607"
                  y1="1.67188"
                  x2="1.22607"
                  y2="7.38616"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" />
                  <stop offset={1} stopColor="#F0F0F0" />
                </linearGradient>
              </defs>
            </svg>
            <span className="mx-5 ml-3 w-32 text-base font-medium text-gray-900 dark:text-white sm:flex-none">
              United States
            </span>
          </div>
          <div className="h-5 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            <div
              className="h-5 rounded-md bg-primary-700 p-1 text-center text-xs font-bold leading-none text-primary-100"
              style={{ width: "35%" }}
            >
              {" "}
              35%
            </div>
          </div>
        </li>
        <li className="w-full items-center sm:flex">
          <div className="mb-3 flex items-center sm:mb-0">
            <svg
              className="h-4 w-4"
              viewBox="0 0 26 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.779053"
                width="25.2567"
                height="16.6429"
                rx="1.75"
                fill="white"
                stroke="#F3F4F6"
                strokeWidth="0.5"
              />
              <mask
                id="mask0"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={26}
                height={18}
              >
                <rect
                  x="0.25"
                  y="0.779053"
                  width="25.2567"
                  height="16.6429"
                  rx="1.75"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </mask>
              <g mask="url(#mask0)">
                <rect
                  x="18.3975"
                  y="0.529053"
                  width="7.35907"
                  height="17.1429"
                  fill="#FF3131"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 17.6719H7.35907V0.529053H0V17.6719Z"
                  fill="#FF3131"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.8804 8.37761C14.6418 8.59995 14.2588 8.38268 14.3272 8.06378L14.718 6.2432L13.4915 6.81463L12.8782 5.10034L12.265 6.81463L11.0385 6.2432L11.4292 8.06378C11.4977 8.38268 11.1147 8.59995 10.8761 8.37761L10.6525 8.16923C10.5244 8.04994 10.326 8.04994 10.198 8.16923L9.81196 8.52891L8.58545 7.95749L9.1987 9.10034L8.84717 9.4279C8.70571 9.55971 8.70571 9.78383 8.84717 9.91564L10.4252 11.3861H12.265L12.5716 13.1003H13.1849L13.4915 11.3861H15.3313L16.9093 9.91564C17.0508 9.78383 17.0508 9.55971 16.9093 9.4279L16.5578 9.10034L17.171 7.95749L15.9445 8.52891L15.5585 8.16923C15.4305 8.04994 15.232 8.04994 15.104 8.16923L14.8804 8.37761Z"
                  fill="#FF3131"
                />
              </g>
            </svg>
            <span className="mx-5 ml-3 w-32 flex-none text-base font-medium text-gray-900 dark:text-white">
              Canada
            </span>
          </div>
          <div className="h-5 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            <div
              className="h-5 rounded-md bg-primary-700 p-1 text-center text-xs font-bold leading-none text-primary-100"
              style={{ width: "26%" }}
            >
              {" "}
              26%
            </div>
          </div>
        </li>
        <li className="w-full items-center sm:flex">
          <div className="mb-3 flex items-center sm:mb-0">
            <svg
              className="h-4 w-4"
              viewBox="0 0 26 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.779053"
                width="25.2567"
                height="16.6429"
                rx="1.75"
                fill="white"
                stroke="#F3F4F6"
                strokeWidth="0.5"
              />
              <mask
                id="mask0"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={26}
                height={18}
              >
                <rect
                  x="0.25"
                  y="0.779053"
                  width="25.2567"
                  height="16.6429"
                  rx="1.75"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </mask>
              <g mask="url(#mask0)">
                <rect
                  x="17.1714"
                  y="0.529053"
                  width="8.58558"
                  height="17.1429"
                  fill="#F44653"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 17.6719H8.58558V0.529053H0V17.6719Z"
                  fill="#1035BB"
                />
              </g>
            </svg>
            <span className="mx-5 ml-3 w-32 flex-none text-base font-medium text-gray-900 dark:text-white">
              France
            </span>
          </div>
          <div className="h-5 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            <div
              className="h-5 rounded-md bg-primary-700 p-1 text-center text-xs font-bold leading-none text-primary-100"
              style={{ width: "18%" }}
            >
              {" "}
              18%
            </div>
          </div>
        </li>
        <li className="w-full items-center sm:flex">
          <div className="mb-3 flex items-center sm:mb-0">
            <svg
              className="h-4 w-4"
              viewBox="0 0 26 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.779297"
                width="25.2522"
                height="16.6429"
                rx="1.75"
                fill="white"
                stroke="#F3F4F6"
                strokeWidth="0.5"
              />
              <mask
                id="mask0"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={26}
                height={18}
              >
                <rect
                  x="0.25"
                  y="0.779297"
                  width="25.2522"
                  height="16.6429"
                  rx="1.75"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </mask>
              <g mask="url(#mask0)">
                <rect
                  x="17.168"
                  y="0.529297"
                  width="8.58408"
                  height="17.1429"
                  fill="#E43D4C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 17.6722H8.58408V0.529297H0V17.6722Z"
                  fill="#1BB65D"
                />
              </g>
            </svg>
            <span className="mx-5 ml-3 w-32 flex-none text-base font-medium text-gray-900 dark:text-white">
              Italy
            </span>
          </div>
          <div className="h-5 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            <div
              className="h-5 rounded-md bg-primary-700 p-1 text-center text-xs font-bold leading-none text-primary-100"
              style={{ width: "14%" }}
            >
              {" "}
              14%
            </div>
          </div>
        </li>
        <li className="w-full items-center sm:flex">
          <div className="mb-3 flex items-center sm:mb-0">
            <svg
              className="h-4 w-4"
              viewBox="0 0 26 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="0.529053"
                width="25.7567"
                height="17.1429"
                rx={2}
                fill="white"
              />
              <mask
                id="mask0"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={26}
                height={18}
              >
                <rect
                  y="0.529053"
                  width="25.7567"
                  height="17.1429"
                  rx={2}
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0)">
                <rect
                  y="0.529053"
                  width="25.7567"
                  height="17.1429"
                  fill="#0A17A7"
                />
                <path
                  d="M-0.951485 0.195719H0H0.613256H0.714042L0.797945 0.251562L5.00683 3.05286H6.04257L10.8708 0.241006L11.3719 -0.0508112V0.529053V0.921924C11.3719 1.14501 11.2604 1.3533 11.0746 1.4769L10.89 1.19941L11.0746 1.47691L7.07914 4.13618V4.94011L10.8133 7.92254C11.2032 8.23391 10.983 8.86239 10.4841 8.86239C10.3801 8.86239 10.2784 8.83164 10.1918 8.774M-0.951485 0.195719L10.1918 8.774M-0.951485 0.195719L-0.208022 0.78951L3.95946 4.118V4.92192L-0.184689 7.68013L-0.333333 7.77907V7.95763V8.52905V9.10892L0.16775 8.8171L4.99603 6.00524H6.03177L10.1918 8.774M-0.951485 0.195719L10.3764 8.49651L10.1918 8.774"
                  fill="#FF2E3B"
                  stroke="white"
                  strokeWidth="0.666667"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 3.3862V5.67191H4.29279V8.43382C4.29279 8.80201 4.59127 9.10048 4.95946 9.10048H6.07914C6.44733 9.10048 6.74581 8.80201 6.74581 8.43382V5.67191H10.9852C11.3534 5.67191 11.6519 5.37343 11.6519 5.00524V4.05286C11.6519 3.68467 11.3534 3.3862 10.9852 3.3862H6.74581V0.529053H4.29279V3.3862H0Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 3.95762H4.90604V3.3862V0.529053H6.13256V3.3862V3.95762H11.0386V5.10048H6.13256V5.67191V8.52905H4.90604V5.67191V5.10048H0V3.95762Z"
                  fill="url(#paint1_linear)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.51945 14.5289L4.43807 15.0587L4.64459 13.9367L3.76973 13.1421L4.97876 12.9784L5.51945 11.9575L6.06015 12.9784L7.26918 13.1421L6.39432 13.9367L6.60084 15.0587L5.51945 14.5289Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.3979 15.3862L17.5306 15.6229L17.7846 14.8147L17.5306 14.0066L18.3979 14.2433L19.2652 14.0066L19.0112 14.8147L19.2652 15.6229L18.3979 15.3862Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.3979 4.52898L17.5306 4.76568L17.7846 3.95755L17.5306 3.14943L18.3979 3.38613L19.2652 3.14943L19.0112 3.95755L19.2652 4.76568L18.3979 4.52898Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22.0771 7.95769L21.2098 8.19439L21.4638 7.38627L21.2098 6.57814L22.0771 6.81484L22.9444 6.57814L22.6904 7.38627L22.9444 8.19439L22.0771 7.95769Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7182 9.10052L13.8509 9.33721L14.105 8.52909L13.8509 7.72097L14.7182 7.95766L15.5855 7.72097L15.3315 8.52909L15.5855 9.33721L14.7182 9.10052Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.2373 10.529L19.8036 10.6474L19.9307 10.2433L19.8036 9.83924L20.2373 9.95759L20.6709 9.83924L20.5439 10.2433L20.6709 10.6474L20.2373 10.529Z"
                  fill="white"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1={0}
                  y1="0.529053"
                  x2={0}
                  y2="9.10048"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" />
                  <stop offset={1} stopColor="#F0F0F0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear"
                  x1={0}
                  y1="0.529053"
                  x2={0}
                  y2="8.52905"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF2E3B" />
                  <stop offset={1} stopColor="#FC0D1B" />
                </linearGradient>
              </defs>
            </svg>
            <span className="mx-5 ml-3 w-32 flex-none text-base font-medium text-gray-900 dark:text-white">
              Australia
            </span>
          </div>
          <div className="h-5 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            <div
              className="h-5 rounded-md bg-primary-700 p-1 text-center text-xs font-bold leading-none text-primary-100"
              style={{ width: "10%" }}
            >
              {" "}
              10%
            </div>
          </div>
        </li>
        <li className="w-full items-center sm:flex">
          <div className="mb-3 flex items-center sm:mb-0">
            <svg
              className="h-4 w-4"
              viewBox="0 0 26 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.779053"
                width="25.2567"
                height="16.6429"
                rx="1.75"
                fill="white"
                stroke="#F3F4F6"
                strokeWidth="0.5"
              />
              <mask
                id="mask0"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={26}
                height={18}
              >
                <rect
                  x="0.25"
                  y="0.779053"
                  width="25.2567"
                  height="16.6429"
                  rx="1.75"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </mask>
              <g mask="url(#mask0)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 6.24334H25.7567V0.529053H0V6.24334Z"
                  fill="#FFA44A"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 17.6718H25.7567V11.9575H0V17.6718Z"
                  fill="#1A9F0B"
                />
                <path
                  d="M12.8783 11.1481C14.0559 11.1481 15.0514 10.2532 15.0514 9.10052C15.0514 7.94786 14.0559 7.0529 12.8783 7.0529C11.7007 7.0529 10.7052 7.94786 10.7052 9.10052C10.7052 10.2532 11.7007 11.1481 12.8783 11.1481Z"
                  fill="#181A93"
                  fillOpacity="0.15"
                  stroke="#181A93"
                  strokeWidth="0.666667"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.8784 9.67191C13.2171 9.67191 13.4916 9.41607 13.4916 9.10048C13.4916 8.78489 13.2171 8.52905 12.8784 8.52905C12.5397 8.52905 12.2651 8.78489 12.2651 9.10048C12.2651 9.41607 12.5397 9.67191 12.8784 9.67191Z"
                  fill="#181A93"
                />
              </g>
            </svg>
            <span className="mx-5 ml-3 w-32 flex-none text-base font-medium text-gray-900 dark:text-white">
              India
            </span>
          </div>
          <div className="h-5 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            <div
              className="h-5 rounded-md bg-primary-700 p-1 text-center text-xs font-bold leading-none text-primary-100"
              style={{ width: "7%" }}
            >
              {" "}
              7%
            </div>
          </div>
        </li>
      </ul>
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Location Overview
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const SessionsByCountryMap: FC = function () {
  const { mode } = useTheme();

  const isDarkTheme = mode === "dark";

  useEffect(() => {
    const previousMap =
      document.getElementsByClassName("svgMap-map-wrapper")[0];
    previousMap?.parentElement?.removeChild(previousMap);

    new svgMap({
      targetElementID: "map",
      colorMin: "#A4CAFE",
      colorMax: "#1A56DB",
      colorNoData: isDarkTheme ? "#4B5563" : "#D1D5DB",
      flagType: "image",
      flagURL: "https://flowbite.com/application-ui/demo/images/flags/{0}.svg",
      data: {
        data: {
          visitors: {
            name: "Visitors:",
            format: "{0}",
            thousandSeparator: ",",
            thresholdMax: 500000,
            thresholdMin: 0,
          },
          change: {
            name: "Change:",
            format: "{0} %",
          },
        },
        applyData: "visitors",
        values: {
          US: { visitors: 272109, change: 4.73 },
          CA: { visitors: 160064, change: 11.09 },
          DE: { visitors: 120048, change: -2.3 },
          GB: { visitors: 110048, change: 3.3 },
          FR: { visitors: 100048, change: 1.3 },
          ES: { visitors: 90048, change: 1.5 },
          JP: { visitors: 56022, change: 3.5 },
          IT: { visitors: 48019, change: 1 },
          NL: { visitors: 40016, change: 2 },
          RU: { visitors: 30016, change: 3.4 },
          CN: { visitors: 50016, change: 6 },
          IN: { visitors: 140016, change: 2 },
          BR: { visitors: 40016, change: 5 },
        },
      },
    });
  }, [isDarkTheme]);

  return <div id="map" className="my-6" />;
};

const LatestCustomers: FC = function () {
  return (
    <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Latest Customers
        </h3>
        <a
          href="#"
          className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
        >
          View all
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="../images/users/neil-sims.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Neil Sims
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  email@flowbite.com
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $320
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="../images/users/bonnie-green.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Bonnie Green
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  email@flowbite.com
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $3467
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="../images/users/michael-gough.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Michael Gough
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  email@flowbite.com
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $67
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="../images/users/thomas-lean.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Thomes Lean
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  email@flowbite.com
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $2367
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="../images/users/lana-byrd.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  Lana Byrd
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  email@flowbite.com
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $367
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Sales Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const AcquisitionOverview: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
        Acquisition Overview
      </h3>
      <div className="my-6">
        <AcquisitionChart />
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table className="min-w-full table-fixed">
                <Table.Head>
                  <Table.HeadCell className="whitespace-nowrap rounded-l border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Top Channels
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Users
                  </Table.HeadCell>
                  <Table.HeadCell className="min-w-[140px] whitespace-nowrap rounded-r border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Acquisition
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Organic Search
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      5,649
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">30%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{ width: "30%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Referral
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      4,025
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">24%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-orange-300"
                              style={{ width: "24%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Direct
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      3,105
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">18%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-teal-400"
                              style={{ width: "18%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Social
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      1251
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">12%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-pink-600"
                              style={{ width: "12%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Other
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      734
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">9%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-indigo-600"
                              style={{ width: "9%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Email
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      456
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">7%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-purple-500"
                              style={{ width: "7%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Acquisition Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const AcquisitionChart: FC = function () {
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const options: ApexCharts.ApexOptions = {
    labels: ["Organic", "Referral", "Direct", "Social", "Other", "Email"],
    colors: ["#16BDCA", "#FDBA8C", "#1A56DB", "#D61F69", "#9061F9", "#6875F5"],
    chart: {
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      colors: [isDarkTheme ? "#111827" : "#fff"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "5%",
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.9,
        },
      },
    },
    tooltip: {
      shared: true,
      followCursor: false,
      fillSeriesColor: false,
      inverseOrder: true,
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
      x: {
        show: true,
        formatter: function (_, { seriesIndex, w }) {
          const label = w.config.labels[seriesIndex];
          return label;
        },
      },
      y: {
        formatter: function (value) {
          return value + "%";
        },
      },
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };
  const series = [30, 24, 18, 12, 9, 7];

  return <Chart height={305} options={options} series={series} type="donut" />;
};

const Transactions: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h3>
          <span className="text-base font-normal text-gray-600 dark:text-gray-400">
            This is a list of latest transactions
          </span>
        </div>
        <div className="shrink-0">
          <a
            href="#"
            className="rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
          >
            View all
          </a>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell>Transaction</Table.HeadCell>
                  <Table.HeadCell>Date &amp; Time</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="bg-white dark:bg-gray-800">
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Bonnie Green</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 23, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $2300
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment refund to{" "}
                      <span className="font-semibold">#00910</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 23, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      -$670
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment failed from{" "}
                      <span className="font-semibold">#087651</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 18, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $234
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="failure">Cancelled</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Lana Byrd</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 15, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $5000
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <span className="mr-2 rounded-md bg-purple-100 py-0.5 px-2.5 text-xs font-medium text-purple-800 dark:bg-purple-200">
                        In progress
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Jese Leos</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 15, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $2300
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">THEMESBERG LLC</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 11, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $560
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Lana Lysle</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 6, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $1437
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment to{" "}
                      <span className="font-semibold">Joseph Mcfall</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 1, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $980
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Alphabet LLC</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Mar 23, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $11,436
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <span className="mr-2 rounded-md bg-purple-100 py-0.5 px-2.5 text-xs font-medium text-purple-800 dark:bg-purple-200">
                        In progress
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Bonnie Green</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Mar 23, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $560
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Transactions Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
